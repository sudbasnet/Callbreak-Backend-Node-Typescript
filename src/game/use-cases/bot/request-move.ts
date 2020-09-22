import Game, { gameStatus } from '../../game.model';
import CustomError from '../../../_helpers/custom-error';
import { RequestHandler } from 'express';
import gameResponse from '../../../_helpers/game-response';
import Bot from '../../../_entities/Bot';
import placeCard from '../process-move';
import Deck, { suits } from '../../../_entities/Deck';

const move: RequestHandler = async (req, res, next) => {
    const userId = req.userId;
    const gameId = req.params.gameId;
    const botId = req.params.botId;

    if (!userId) {
        throw new CustomError('The user does not exist.', 404);
    }

    try {
        const game = await Game.findById(gameId);

        if (!game) {
            throw new CustomError('The game does not exist!', 404);
        }

        if (String(game.createdBy) != userId) {
            throw new CustomError('Invalid Request!!', 404);;
        } else {
            if (String(game.currentTurn) != botId) {
                throw new CustomError('Not bot turn to play!', 500);
            }

            if (game.status === gameStatus.ACTIVE) {
                // Bot.makeMove()
                const playersIndex = game.privatePlayerList.findIndex(x => String(x.id) === botId)
                console.log('playersIndex: ' + playersIndex)
                const botCards = game.privatePlayerList[playersIndex].cards || []

                let cardsOnTable = game.cardsOnTable
                if (cardsOnTable.length === 4) {
                    cardsOnTable = []
                    game.currentWinningCard = undefined
                }

                let playedCard = Bot.makeMove(botCards, String(game.currentSuit), game.currentWinningCard || null)

                const suit: suits = playedCard.suit
                const value = playedCard.value
                const playedBy = botId

                if (botCards) {
                    const i = botCards.findIndex(x => x.suit === suit && x.value === value)
                    botCards[i].playedBy = playedBy
                    cardsOnTable.push(botCards[i])

                    if (suit === suits.SPADES && game.currentSuit != suit) {
                        game.overriddenBySpade = true
                    }

                    if (game.currentWinningCard && game.currentSuit) {
                        game.currentWinningCard = Deck.calculateCallbreakWinner(game.currentWinningCard, botCards[i], game.currentSuit)
                    } else {
                        game.currentWinningCard = botCards[i]
                        game.currentSuit = suit
                    }

                    botCards.splice(i, 1)
                }

                game.privatePlayerList[playersIndex].possibleMoves = []
                game.markModified('privatePlayerList')

                const playerListIndex = game.playerList.findIndex(x => String(x.id) === botId)

                console.log('playerListIndex: ' + playerListIndex)

                if (game.cardsOnTable.length === 4) {
                    // set scores
                    const winnerIndex = game.playerList.findIndex(x => String(x.id) === String(game.currentWinningCard?.playedBy))
                    console.log('winnerIndex: ' + winnerIndex)
                    const winner = game.playerList[winnerIndex]
                    if (winner.score >= winner.bet) {
                        winner.score += 0.1
                        winner.totalScore += 0.1
                    } else {
                        winner.score += 1
                        winner.totalScore += 1
                    }
                    game.markModified('playerList')

                    // not if the round is over
                    game.currentTurn = winner.id

                    // cards on the table 
                    game.playedHands.push(game.cardsOnTable)
                    // game.cardsOnTable = []
                } else {
                    game.currentTurn = game.playerList[(playerListIndex + 1) % 4].id
                }

                if (game.handNumber === 13) {
                    game.roundNumber += 1
                    game.handNumber = 1
                    game.currentTurn = game.playerList[(game.roundNumber - 1) % 4].id
                } else {
                    game.handNumber += 1
                }
                const savedGame = await game.save();

                res.status(200).json(gameResponse(userId, savedGame));
            } else {
                throw new CustomError('This game is no longer active!', 500);
            }
        }
    } catch (err) {
        next(err);
    }
};

export default move;