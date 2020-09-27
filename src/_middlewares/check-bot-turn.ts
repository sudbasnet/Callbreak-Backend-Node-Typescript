import Game, { gameStatus } from '../game/game.model';
import CustomError from '../_helpers/custom-error';
import { RequestHandler } from 'express';

const isBotTurn: RequestHandler = async (req, res, next) => {
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
            throw new CustomError('Invalid request!', 500);
        }
        if (String(game.currentTurn) != botId) {
            throw new CustomError('Not bot turn to play!', 500);
        }
        if (game.status != gameStatus.ACTIVE) {
            throw new CustomError('Game is not active!', 500);
        }
        next();
    } catch (err) {
        next(err);
    }
};

export default isBotTurn;