import { GameRepository } from '../repositories/GameRepository';
import { RequestHandler } from 'express';
import CustomError from '../entities/classes/CustomError';
import { EGameStatus } from '../entities/enums/enums';

const isPlayerTurn: RequestHandler = async (req, res, next) => {
    const Game = new GameRepository();
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
        if (game.status != EGameStatus.ACTIVE) {
            throw new CustomError('Game is not active!', 500);
        }
        const isValidPlayer = game.privatePlayerList.map(x => x.id).includes(userId);
        if (!isValidPlayer) {
            throw new CustomError('Incorrect Game', 404);
        }
        next();
    } catch (err) {
        next(err);
    }
};

export default isPlayerTurn;