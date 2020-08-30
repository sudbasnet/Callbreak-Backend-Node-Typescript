import Game, { GameSchema, gameStatus } from '../game.model';
import { RequestHandler } from 'express';
import User from '../../user/user.model';
import CustomError from '../../_helpers/custom-error';

const gameData: RequestHandler = async (req, res, next) => {
    const userId = req.userId;

    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new CustomError('Invalid Request', 404);
        }

        let incompleteGame: GameSchema;
        const incompleteGames = (await Game.find({ status: { $ne: gameStatus.COMPLETE } })).filter(g => g.players.map(p => p.playerId).includes(userId));
        if (incompleteGames.length > 0) {
            incompleteGame = incompleteGames[0];
            const currentPlayer = incompleteGame.players.filter(p => String(p.playerId) === String(userId))[0];
            res.status(200).json({ _id: incompleteGame._id, global: incompleteGame.global, player: currentPlayer });
        } else {
            throw new CustomError('The current user has no pre-existing game', 404);
        }
    } catch (err) {
        next(err);
    }
};

export default gameData;