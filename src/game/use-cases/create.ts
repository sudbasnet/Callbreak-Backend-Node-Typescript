import Game, { gameStatus } from '../game.model';
import { RequestHandler } from 'express';
import User from '../../user/user.model';
import CustomError from '../../_helpers/custom-error';

const create: RequestHandler = async (req, res, next) => {
    const userId = req.userId;
    const userName = req.userName;
    const gameType = req.params.gameType;

    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new CustomError('Invalid Request', 404);
        }

        // if the player has already created a game, then return the existing game
        const incompleteGame = await Game.findOne({ createdBy: userId, status: { $ne: gameStatus.COMPLETE } });
        if (incompleteGame) {
            res.status(200).json({ gameType: gameType, gameId: incompleteGame._id });
        } else {
            const game = new Game({
                global: {
                    gameNumber: 0,
                    roundNumber: 0,
                    turnNumber: 0,
                    scores: [],
                    bets: [],
                    playedRounds: [],
                    currentTurn: userId,
                    nextTurn: null,
                    currentSuit: null,
                    overriddenBySpades: false
                },
                players:
                    [
                        {
                            playerId: userId,
                            playerName: userName,
                            cards: [],
                            possibleMoves: []
                        }
                    ],

                status: gameStatus.WAITING,
                createdBy: userId,
                gameType: gameType,
                start: new Date()
            });
            const savedGame = await game.save();
            res.status(200).json({ gameType: gameType, gameId: savedGame._id });
        }
    } catch (err) {
        next(err);
    }
};

export default create;