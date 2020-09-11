import Game, { gameStatus } from '../game.model';
import { RequestHandler } from 'express';
import User from '../../user/user.model';
import CustomError from '../../_helpers/custom-error';
import gameResponse from '../../_helpers/game-response';

const create: RequestHandler = async (req, res, next) => {
    const userId = req.userId;
    const userName = req.userName;
    const gameType = req.params.gameType;

    if (!userId) {
        throw new CustomError('The user does not exist.', 404);
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new CustomError('Invalid Request', 404);
        }

        // if the player has already created a game, then return the existing game
        const incompleteGame = await Game.findOne({ createdBy: userId, status: { $ne: gameStatus.INACTIVE } });
        if (incompleteGame) {
            const currentPlayer = incompleteGame.players.filter(p => String(p.id) === String(userId))[0];
            res.status(200).json({ _id: incompleteGame._id, global: incompleteGame.global, player: currentPlayer, status: incompleteGame.status, createdBy: incompleteGame.createdBy });
        } else {
            const game = new Game({
                global: {
                    gameNumber: 1,
                    roundNumber: 1,
                    turnNumber: 1,
                    playerList: [
                        {
                            id: userId,
                            name: userName,
                            bet: 0,
                            score: 0,
                            totalScore: 0,
                            betPlaced: false
                        }
                    ],
                    scores: [],
                    playedRounds: [],
                    currentTurn: userId,
                    currentSuit: null,
                    overriddenBySpades: false,

                    gameType: gameType,
                    start: new Date()
                },
                players:
                    [
                        {
                            id: userId,
                            cards: [],
                            possibleMoves: []
                        }
                    ],
                status: gameStatus.WAITING,
                createdBy: userId,
            });
            const savedGame = await game.save();

            res.status(200).json(gameResponse(userId, savedGame));
        }
    } catch (err) {
        next(err);
    }
};

export default create;