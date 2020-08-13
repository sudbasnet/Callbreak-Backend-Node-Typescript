// allows to cancel a game that has not been started
import Game from '../game.model';
import { RequestHandler } from 'express';

const cancel: RequestHandler = async (req, res, next) => {
    const userId = req.userId;
    const gameId = req.body.gameId;
    const gameType = req.params.gameType;

    try {
        const game = await Game.findById(gameId);
        if (game && game.status != 'on') {
            await Game.deleteOne({ _id: gameId });
        }
        res.status(201).json({ message: gameType + ' game ' + gameId + ' has been deleted.' });
    } catch (err) {
        next(err);
    }
};

export default cancel;