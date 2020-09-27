import Game from '../game.model';
import User from '../../user/user.model';
import { RequestHandler } from 'express';
import CustomError from '../../_helpers/custom-error';
import gameResponse from '../../_helpers/game-response';

const join: RequestHandler = async (req, res, next) => {
    const userId = req.userId;
    const userName = req.userName;
    const gameId = req.params.gameId;

    if (!userId || !userName) {
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

        const playerAlreadyJoined = game.playerList.map(x => x.id).includes(userId);
        const gameIsFull = game.privatePlayerList.length === 4;

        if (playerAlreadyJoined || gameIsFull) {
            throw new CustomError('Cannot join game!', 500);
        }
        if (game.privatePlayerList.length <= 4) {
            game.addUserToGame(player);
            const savedGame = await game.save();

            res.status(200).json(gameResponse(userId, savedGame));
        }
    } catch (err) {
        next(err);
    }
};

export default join;