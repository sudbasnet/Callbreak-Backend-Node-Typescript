import Game from '../game.model';
import { RequestHandler } from 'express';

const create: RequestHandler = async (req, res, next) => {
    const userId = req.userId;
    const gameType = req.params.gameType;

    try {
        const game = new Game({
            status: 'waiting',
            gameType: gameType,
            createdBy: userId,
            players: [{
                order: 0,
                userType: 'player',
                userId: userId
            }]
        });
        const savedGame = await game.save();
        res.status(200).json({ gameType: gameType, gameId: savedGame._id });
    } catch (err) {
        next(err);
    }
};

export default create;