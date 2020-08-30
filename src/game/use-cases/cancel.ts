// allows to cancel a game that has not been started
import Game, { gameStatus } from '../game.model';
import { RequestHandler } from 'express';

const cancel: RequestHandler = async (req, res, next) => {
    const userId = req.userId;
    const gameId = req.body.gameId;
    const gameType = req.params.gameType;

    try {
        const game = await Game.findById(gameId);

        if (game && game.status != gameStatus.ACTIVE && userId) {
            // delete game if creator cancels
            if (String(game.createdBy) === String(userId)) { // use javascript String function, nothing else worked
                await Game.deleteOne({ _id: gameId });
                res.status(201).json({ message: gameType + ' game ' + gameId + ' has been deleted.' });
            } else {
                // delete player if not creator
                game.players = game.players.filter(p => String(p.playerId) != String(userId));
                await game.save();
                res.status(201).json({ message: 'player ' + userId + ' has left the game.' });
            }
        }
    } catch (err) {
        next(err);
    }
};

export default cancel;