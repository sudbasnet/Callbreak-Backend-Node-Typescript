import Game, { Player } from '../game.model';
import { RequestHandler } from 'express';
import CustomError from '../../_helpers/custom-error';

const join: RequestHandler = async (req, res, next) => {
    const userId = req.userId;
    const gameType = req.params.gameType;
    const gameId = req.params.gameId;

    try {
        const game = await Game.findById(gameId);
        if (game) {
            const playerAlreadyJoined = game.players.map(x => x.userId).includes(userId);
            if (playerAlreadyJoined) {
                throw new CustomError('Cannot join same game again.', 500, null);
            }
            if (game.players.length < 5) {
                let player: Player = {
                    order: game.players.length,
                    userType: 'player',
                    userId: userId
                };
                game.players.push(player);
                game.end = new Date();
                const savedGame = await game.save();
                res.status(200).json(savedGame);
            }
        } else {
            throw new CustomError('The game is already full.', 500,);
        }
    } catch (err) {
        next(err);
    }
};

export default join;