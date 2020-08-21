import Game from '../game.model';
import { RequestHandler } from 'express';
import CustomError from '../../_helpers/custom-error';

const join: RequestHandler = async (req, res, next) => {
    const userId = req.userId;
    const gameId = req.params.gameId;

    try {
        const game = await Game.findById(gameId);
        if (!game) {
            throw new CustomError('Cannot find game.', 500,);
        }

        const playerAlreadyJoined = game.players.map(x => x.playerId).includes(userId);

        if (playerAlreadyJoined) {
            throw new CustomError('Cannot join same game again.', 500);
        }
        if (game.players.length <= 4) {
            game.players.push(
                {
                    playerId: userId
                });
            const savedGame = await game.save();
            res.status(200).json(savedGame);
        }
    } catch (err) {
        next(err);
    }
};

export default join;