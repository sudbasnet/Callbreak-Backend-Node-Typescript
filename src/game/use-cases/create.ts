import Game, { gameStatus } from '../game.model';
import { RequestHandler } from 'express';

const create: RequestHandler = async (req, res, next) => {
    const userId = req.userId;
    const gameType = req.params.gameType;

    try {
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
                        cards: [],
                        possibleMoves: []
                    }
                ],
            log: {
                status: gameStatus.WAITING,
                createdBy: userId,
                gameType: gameType,
                players: [userId],
                start: new Date()
            }
        });
        const savedGame = await game.save();
        res.status(200).json({ gameType: gameType, gameId: savedGame._id });
    } catch (err) {
        next(err);
    }
};

export default create;