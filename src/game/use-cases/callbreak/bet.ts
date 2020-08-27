import Game, { gameStatus } from '../../game.model';
import CustomError from '../../../_helpers/custom-error';
import { RequestHandler } from 'express';

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
    const bet = req.body.bet;

    try {
        const game = await Game.findById(gameId);

        if (!game) {
            throw new CustomError('The game does not exist.', 404);
        }

        const isValidPlayer = game.players.map(x => x.playerId).includes(userId);
        if (!isValidPlayer) {
            throw new CustomError('Incorrect Game', 404);
        }

        if (bet > 13 || bet < 1) {
            throw new CustomError('Bet needs to be between 1 and 13', 500);
        }

        if (game.status === gameStatus.DEALT) {
            const ind = game.global.bets.findIndex(x => x.playerId === userId);
            game.global.bets[ind].bet = bet;

            if (game.playersReady === 3) {
                game.status = gameStatus.ON;
            } else {
                game.playersReady += 1;
            }

            const savedGame = await game.save();

            res.status(200).json({ message: "bet has been saved." });
        } else {
            throw new CustomError('You cannot start this game.', 500);
        }
    } catch (err) {
        next(err);
    }
};

export default bet;