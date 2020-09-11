import Game, { gameStatus } from '../game.model';
import CustomError from '../../_helpers/custom-error';
import { RequestHandler } from 'express';
import socketIO from '../../socket';
import gameResponse from '../../_helpers/game-response';

/*
POST Request
============
userId --> comes from the req, jwt token
gameType --> comes from the params as well
gameId --> comes from the req.params
bet --> comes from the body of the POST request

Checks Required (other than typescript specific):
================================================
bet cannot be more than 13 and less than 1
player is valid, ie; player exits in the game.players 

Return??
=======
global: {}
player: {}
log: {}

*/
const bet: RequestHandler = async (req, res, next) => {
    const userId = req.userId;
    const gameId = req.params.gameId;
    const bet: number = req.body.bet;

    if (!userId) {
        throw new CustomError('The user does not exist.', 404);
    }

    try {
        const game = await Game.findById(gameId);

        if (!game) {
            throw new CustomError('The game does not exist.', 404);
        }

        const isValidPlayer = game.players.map(x => x.id).includes(userId);
        if (!isValidPlayer) {
            throw new CustomError('Incorrect Game', 404);
        }

        if (bet > 13 || bet < 1) {
            throw new CustomError('Bet needs to be between 1 and 13', 500);
        }

        if (game.status === gameStatus.ACTIVE) {
            const ind = game.global.playerList.findIndex(x => String(x.id) === String(userId));

            game.global.playerList[ind].bet = bet;
            game.markModified('global.playerList');

            game.global.playerList[ind].betPlaced = true;
            game.markModified('global.playerList');

            const savedGame = await game.save();

            socketIO.getIO().emit('moves', { bet: 'bets have been set' });
            res.status(200).json(gameResponse(userId, savedGame));
        } else {
            throw new CustomError('You cannot start this game.', 500);
        }
    } catch (err) {
        next(err);
    }
};

export default bet;