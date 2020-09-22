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

const returnMoveResult: RequestHandler = async (req, res, next) => {
    const userId = req.userId;
    const gameId = req.params.gameId;

    if (!userId) {
        throw new CustomError('The user does not exist.', 404);
    }

    try {
        const game = await Game.findById(gameId);

        if (!game) {
            throw new CustomError('The game does not exist.', 404);
        }

        const isUsersTurn = userId === String(game.currentTurn)
        if (!isUsersTurn) {
            next();
        } else {

            const playerListIndex = game.playerList.findIndex(x => String(x.id) === userId)

            if (game.cardsOnTable.length === 4) {
                // set scores
                const winnerIndex = game.playerList.findIndex(x => String(x.id) === String(game.currentWinningCard?.playedBy))
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
                game.currentTurn = game.playerList[(playerListIndex + 1) % 4].id;
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
        }
    } catch (err) {
        next(err);
    }
};

export default returnMoveResult;