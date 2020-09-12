import Game, { GameSchema, gameStatus } from '../game.model';
import { RequestHandler } from 'express';
import User from '../../user/user.model';
import CustomError from '../../_helpers/custom-error';
import gameResponse from '../../_helpers/game-response';

const gameData: RequestHandler = async (req, res, next) => {
    const userId = req.userId;
    if (!userId) {
        throw new CustomError('The user does not exist.', 404);
    }
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new CustomError('Invalid Request', 404);
        }

        let incompleteGame: GameSchema;
        const activeGames = await Game.find({ status: { $ne: gameStatus.INACTIVE } });
        const incompleteGames = activeGames.filter(g => g.players.map(p => String(p.id)).includes(userId));
        if (incompleteGames.length > 0) {
            incompleteGame = incompleteGames[0];
            res.status(200).json(gameResponse(userId, incompleteGame));
        } else {
            throw new CustomError('The current user has no pre-existing game', 404);
        }
    } catch (err) {
        next(err);
    }
};

export default gameData;