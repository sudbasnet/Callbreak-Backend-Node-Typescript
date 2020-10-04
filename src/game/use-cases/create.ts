
import { GameRepository } from '../../repositories/GameRepository';
import { UserRepository } from '../../repositories/UserRepository';
import { RequestHandler } from 'express';
import CustomError from '../../entities/classes/CustomError';
import gameResponse from '../../helpers/game-response';
import { EGameStatus } from '../../entities/enums/enums';
import { initializedGameScoresItem, initializedPlayerListItem, initializedPrivatePlayerListItem } from '../../entities/interfaces/IGameModel';

const create: RequestHandler = async (req, res, next) => {
    const Game = new GameRepository();
    const User = new UserRepository();
    const userId = req.userId;
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
        const incompleteGame = await Game.findOne({ createdBy: userId, status: { $ne: EGameStatus.INACTIVE } });

        if (incompleteGame) {
            res.status(200).json(gameResponse(userId, incompleteGame));
        } else {
            const game = await Game.create({
                status: EGameStatus.WAITING,
                createdBy: user._id,
                handNumber: 0,
                roundNumber: 1,
                playerList: [initializedPlayerListItem(user)],
                gameScores: [initializedGameScoresItem(user._id)],
                playedHands: [],
                cardsOnTable: [],
                currentTurn: null,
                overriddenBySpade: false,
                gameType: gameType,
                start: new Date(),
                privatePlayerList: [initializedPrivatePlayerListItem(user)]
            });
            const savedGame = await Game.save(game);

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
