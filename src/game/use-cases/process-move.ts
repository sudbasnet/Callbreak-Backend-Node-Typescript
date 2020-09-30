import Game, { GameSchema } from '../game.model';
import { RequestHandler } from 'express';
import CustomError from '../../_helpers/custom-error';
import Deck, { Card, suits } from '../../_entities/Deck';
import gameResponse from '../../_helpers/game-response';


const placeCard: RequestHandler = async (req, res, next) => {
    const userId = req.userId;
    const userName = req.userName;
    const gameId = req.params.gameId;
    const { suit, value, playedBy } = req.body;

    if (!userId || !userName) {
        throw new CustomError('The user does not exist.', 404);
    }

    try {
        const game = await Game.findById(gameId)
        if (!game) {
            throw new CustomError('Cannot find game.', 404);
        }

        const privatePlayerListIndex = game.privatePlayerList.findIndex(x => String(x.id) === String(game.currentTurn));
        const playerListIndex = game.playerList.findIndex(x => String(x.id) === String(game.currentTurn));
        const playerPrivateListItem = game.privatePlayerList[privatePlayerListIndex];

        if (playerPrivateListItem.cards) {
            const playedCardPosition = playerPrivateListItem.cards.findIndex(x => x.suit === suit && x.value === value);
            if (playedCardPosition < 0) {
                throw new CustomError('Invalid card played!', 500);
            }
            playerPrivateListItem.cards.splice(playedCardPosition, 1);
        }

        // make a new instance of the played card
        const playedCard = new Card(suit, value, playedBy);

        if (game.cardsOnTable.length === 4 || game.cardsOnTable.length === 0) {
            // first card on table of new Hand
            game.cardsOnTable = [];
            game.cardsOnTable.push(playedCard);
            game.currentSuit = playedCard.suit;
            game.currentWinningCard = playedCard;
            game.currentTurn = game.playerList[(playerListIndex + 1) % 4].id;
            game.handNumber += 1;
        } else if (game.cardsOnTable.length === 3 && game.currentWinningCard && game.currentSuit) {
            // last card on table of current Hand
            game.cardsOnTable.push(playedCard);

            const handWinnner = Deck.calculateCallbreakWinner(game.currentWinningCard, playedCard, game.currentSuit);
            const handWinnnerIndex = game.playerList.findIndex(x => String(x.id) === String(handWinnner.playedBy));

            if (game.playerList[handWinnnerIndex].score >= game.playerList[handWinnnerIndex].bet) {
                game.playerList[handWinnnerIndex].ots += 1;
                game.playerList[handWinnnerIndex].totalScore += 0.1;
            } else {
                game.playerList[handWinnnerIndex].score += 1;
                game.playerList[handWinnnerIndex].totalScore += 1;
            }

            game.overriddenBySpade = false;
            game.currentSuit = undefined;
            game.currentWinningCard = undefined;
            game.playedHands.push(game.cardsOnTable);

            if (game.handNumber === 13) {
                // if last Hand of the Round (13th Hand)
                game.playerList.forEach(p => {
                    if (p.score < p.bet) {
                        p.score *= -1;
                    }
                    game.gameScores.push({
                        roundNumber: game.roundNumber,
                        playerId: p.id,
                        score: p.score
                    });
                });

                game.roundNumber += (game.roundNumber < 5) ? 1 : 0;
                game.handNumber = 1;
                game.playedHands = [];
                game.currentTurn = game.playerList[(game.roundNumber - 1) % 4].id;
            } else {
                game.currentTurn = handWinnner.playedBy;
            }
        } else if ((game.cardsOnTable.length === 1 || game.cardsOnTable.length === 2) && game.currentWinningCard && game.currentSuit) {
            game.cardsOnTable.push(playedCard);
            game.currentWinningCard = Deck.calculateCallbreakWinner(game.currentWinningCard, playedCard, game.currentSuit);
            if (game.currentWinningCard.suit != game.currentSuit) {
                game.overriddenBySpade = true;
            }
            game.currentTurn = game.playerList[(playerListIndex + 1) % 4].id;
        } else {
            throw new CustomError('Invalid Request!', 500);
        }

        game.markModified('privatePlayerList');
        game.markModified('playerList');
        const savedGame = await game.save();

        res.status(200).json(gameResponse(userId, savedGame));

    } catch (err) {
        next(err);
    }
};

export default placeCard;