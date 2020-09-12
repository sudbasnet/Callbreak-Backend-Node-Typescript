// POST request for updating the data from the frontend to the backend

/*

data will be received in the format: 
====================================
userId:  // comes from auth token <-- this should be the current player
gameType: // comes from param
gameId: // comes from param
playedCard: { suit: , value: } // comes from body this is the card that the player played

need to check the following:
=============================
is the user the current user? 
what is the current game, round and turn number?

if the user is not the current user, then error.

gameNumber: 0, 1, 2, 3, 4 <-- possible values
roundNumber: 0, 1, 2, ... 12 <-- possible values
turnNumber: 0, 1, 2, 3 <-- possible values

if currentTurnNumber == 3 :
    roundNumber ++;
        if roundNumber == 12:
            gameNumber ++
turnNumber = (currentTurnNumber + 1) % 4; 
newTurnNumber % 4 is the player's index who is the new nextPlayer

if turnnumber === 12, means the game is over
*/

import Game from '../game.model';
import { Card } from '../../_entities/Deck';
import CustomError from '../../_helpers/custom-error';
import { RequestHandler } from 'express';
import gameResponse from '../../_helpers/game-response';

const updateGameDb: RequestHandler = async (req, res, next) => {
    const userId = req.userId;
    const gameId = req.params.gameId;
    const suit: string = req.body.card.suit;
    const value: string = req.body.card.value;
    const playedCard = new Card(suit, value);

    if (!userId) {
        throw new CustomError('The user does not exist.', 404);
    }

    const currentPlayer = req.body.nextPlayer;

    try {
        const game = await Game.findById(gameId);

        if (!game) {
            throw new CustomError('The game does not exist.', 404);
        }

        if (userId != currentPlayer) {
            next();
        }

        const currentPlayerIndex = game.players.findIndex(x => x.id === userId);
        let player = game.players[currentPlayerIndex];

        if (game.currentSuit && game.currentWinningCard && player.cards) {
            let possibleMoves: Card[] = player.cards;

            const currentSuit = game.currentSuit;
            const currentWinningCard = game.currentWinningCard;
            const overriddenBySpade = game.overriddenBySpade;

            if (!overriddenBySpade) {
                possibleMoves = player.cards.filter(x => x.suit === currentWinningCard.suit && x.value > currentWinningCard.value);
                if (possibleMoves?.length === 0) {
                    // means we do not have a card of the same suit that can win
                    possibleMoves = player.cards.filter(x => x.suit === currentWinningCard.suit);

                    if (possibleMoves?.length === 0) {
                        // means we do not even have anything of the same suit
                        possibleMoves = player.cards.filter(x => x.suit === 'spades');

                        if (possibleMoves?.length === 0) {
                            // means we dont have any spades either
                            possibleMoves = player.cards;
                        }
                    }
                }
            } else {
                possibleMoves = player.cards.filter(x => x.suit === currentSuit);
                if (possibleMoves.length === 0) {
                    // means we dont have card of original suit
                    possibleMoves = player.cards.filter(x => x.suit === currentWinningCard.suit && x.value > currentWinningCard.value);

                    if (possibleMoves.length === 0) {
                        // means we can't win
                        possibleMoves = player.cards;
                    }
                }
            }

            game.players[currentPlayerIndex].possibleMoves = possibleMoves;
            const savedGame = await game.save();
            res.status(200).json(gameResponse(userId, savedGame));
        } else {
            throw new CustomError('Invalid Request', 500);
        }
    } catch (err) {
        next(err);
    }
};

export default updateGameDb;