import Game from '../game/game.model';
import { RequestHandler } from 'express';
import CustomError from '../_helpers/custom-error';

const isPlayerTurn: RequestHandler = async (req, res, next) => {
    const userId = req.userId;
    const userName = req.userName;
    const gameId = req.params.gameId;

    if (!userId || !userName) {
        throw new CustomError('The user does not exist.', 404);
    }

    try {
        const game = await Game.findById(gameId)
        if (!game) {
            throw new CustomError('Cannot find game.', 404);
        }
        if (String(game.currentTurn) != userId) {
            throw new CustomError('Not your turn.', 500);
        }
        next();
    } catch (err) {
        next(err);
    }
};

export default isPlayerTurn;