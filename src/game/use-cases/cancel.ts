// allows to cancel a game that has not been started
import Game from '../game.model';
import User from '../../user/user.model';
import { RequestHandler } from 'express';
import CustomError from '../../entities/classes/CustomError';
import { EGameStatus } from '../../entities/enums/enums';

const cancel: RequestHandler = async (req, res, next) => {
    const userId = req.userId;
    const userName = req.userName;
    const gameId = req.body.gameId;
    const gameType = req.params.gameType;

    try {
        const game = await Game.findById(gameId);

        if (!game) {
            throw new CustomError('Game does not exist!', 404);
        }

        if (!userId || !userName) {
            throw new CustomError('User does not exist!', 404);
        }

        const isValidPlayer = game.privatePlayerList.map(x => x.id).includes(userId);
        if (!isValidPlayer) {
            throw new CustomError('User does not have any game!', 404);
        }

        // delete game if creator cancels
        if (String(game.createdBy) === userId) { // use javascript String function, nothing else worked
            await Game.deleteOne({ _id: gameId });
            res.status(201).json({ message: gameType + ' game ' + gameId + ' has been deleted.' });
        } else {
            // delete player if not creator
            if (game.status === EGameStatus.ACTIVE) {
                const playersIndex = game.privatePlayerList.findIndex(p => String(p.id) === String(userId));
                const playerListIndex = game.playerList.findIndex(p => String(p.id) === String(userId));

                let bots = await User.find({ role: 'bot' });

                for (const bot of bots) {
                    if (!game.privatePlayerList.map(x => x.id).includes(bot._id)) {

                        game.privatePlayerList[playersIndex].id = bot._id
                        game.privatePlayerList[playersIndex].name = bot.name
                        game.privatePlayerList[playersIndex].bot = true

                        game.playerList[playerListIndex].id = bot._id
                        game.playerList[playerListIndex].name = bot.name
                        game.playerList[playerListIndex].bot = true

                        if (String(game.currentTurn) === userId) {
                            game.currentTurn = bot._id
                        }

                        break;
                    }
                }
                await game.save();
            } else {
                game.privatePlayerList = game.privatePlayerList.filter(p => String(p.id) != userId);
                game.playerList = game.playerList.filter(p => String(p.id) != userId);
                await game.save();
            }
            res.status(201).json({ message: userName + ' has left the game.' });
        }
    } catch (err) {
        next(err);
    }
};

export default cancel;