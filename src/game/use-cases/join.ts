import Game from '../game.model';
import User from '../../user/user.model';
import { RequestHandler } from 'express';
import CustomError from '../../_helpers/custom-error';
import gameResponse from '../../_helpers/game-response';

const join: RequestHandler = async (req, res, next) => {
    const userId = req.userId;
    const userName = req.userName;
    const gameId = req.params.gameId;

    if (!userId) {
        throw new CustomError('The user does not exist.', 404);
    }

    try {
        const game = await Game.findById(gameId);
        if (!game) {
            throw new CustomError('Cannot find game.', 404);
        }

        const player = await User.findById(userId);
        if (!player) {
            throw new CustomError('Cannot find user.', 404);
        }

        const playerAlreadyJoined = game.players.map(x => x.id).includes(userId);

        if (playerAlreadyJoined) {
            throw new CustomError('Cannot join same game again.', 500);
        }
        if (game.players.length <= 4) {
            game.players.push(
                {
                    id: userId,
                    name: userName
                });
            const savedGame = await game.save();
            res.status(200).json(gameResponse(userId, savedGame));
        }
    } catch (err) {
        next(err);
    }
};

export default join;