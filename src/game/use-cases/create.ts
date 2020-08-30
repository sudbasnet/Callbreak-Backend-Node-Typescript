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
        const incompleteGame = await Game.findOne({ createdBy: userId, status: { $ne: gameStatus.INACTIVE } });
        if (incompleteGame) {
            const currentPlayer = incompleteGame.players.filter(p => String(p.playerId) === String(userId))[0];
            res.status(200).json({ _id: incompleteGame._id, global: incompleteGame.global, player: currentPlayer, status: incompleteGame.status, createdBy: incompleteGame.createdBy });
        } else {
            const game = new Game({
                global: {
                    gameNumber: 0,
                    roundNumber: 0,
                    turnNumber: 0,
                    playerList: [
                        {
                            playerId: userId,
                            playerName: userName
                        }
                    ],
                    scores: [],
                    bets: [],
                    ready: [],
                    playedRounds: [],
                    currentTurn: userId,
                    nextTurn: null,
                    currentSuit: null,
                    overriddenBySpades: false,

                    gameType: gameType,
                    start: new Date()
                },
                players:
                    [
                        {
                            playerId: userId,
                            cards: [],
                            possibleMoves: []
                        }
                    ],
                status: gameStatus.WAITING,
                createdBy: userId,
            });
            const savedGame = await game.save();
            const currentPlayer = savedGame.players.filter(p => String(p.playerId) === String(userId))[0];
            res.status(200).json({ _id: savedGame._id, global: savedGame.global, player: currentPlayer, status: savedGame.status, createdBy: savedGame.createdBy });
        }
    } catch (err) {
        next(err);
    }
};

export default create;