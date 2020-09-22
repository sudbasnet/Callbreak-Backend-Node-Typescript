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
            res.status(200).json(gameResponse(userId, incompleteGame));
        } else {
            const game = new Game({
                status: gameStatus.WAITING,
                createdBy: userId,

                handNumber: 1,
                roundNumber: 1,

                playerList: [
                    {
                        id: userId,
                        name: userName,
                        bet: 0,
                        bot: false,
                        score: 0,
                        totalScore: 0,
                        betPlaced: false
                    }
                ],
                gameScores: [{ roundNumber: 1, playerId: userId, score: 0 }],
                playedHands: [],
                cardsOnTable: [],

                currentTurn: null,
                currentSuit: null,
                currentWinningCard: null,
                overriddenBySpade: false,

                gameType: gameType,
                start: new Date(),

                privatePlayerList:
                    [
                        {
                            id: userId,
                            name: req.userName,
                            bot: false,
                            cards: [],
                            possibleMoves: []
                        }
                    ],

            });
            const savedGame = await game.save()

            res.status(200).json(gameResponse(userId, savedGame));
        }
    } catch (err) {
        next(err);
    }
};

// io.on('connection', socket => {
//     console.log('Websockets connected.');
// });



export default create;