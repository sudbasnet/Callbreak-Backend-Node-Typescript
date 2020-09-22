import Game, { gameStatus } from '../game.model';
import User, { UserSchema } from '../../user/user.model';
import Deck from '../../_entities/Deck';
import CustomError from '../../_helpers/custom-error';
import { RequestHandler } from 'express';
import gameResponse from '../../_helpers/game-response';

const fetchBotUserAccounts = async () => {
    const botUserAccounts = await User.find({ role: 'bot' })
    return botUserAccounts
}

const initializedPrivatePlayerListItem = (user: UserSchema) => {
    return {
        id: user._id,
        name: user.name,
        bot: user.role === 'bot' ? true : false
    }
}

const initializedPlayerListItem = (user: UserSchema) => {
    return {
        id: user._id,
        name: user.name,
        bot: user.role === 'bot' ? true : false,
        bet: 0,
        score: 0,
        totalScore: 0,
        betPlaced: false
    }
}

const start: RequestHandler = async (req, res, next) => {
    const userId = req.userId;
    const gameId = req.params.gameId;

    const { arrayOfDealtCards } = Deck.dealCards(13, 4);

    if (!userId) {
        throw new CustomError('The user does not exist.', 404);
    }

    try {
        const game = await Game.findById(gameId);
        if (!game) {
            throw new CustomError('The game does not exist.', 404);
        }

        const playerIsValid = game.privatePlayerList.map(x => x.id).includes(userId);
        const hostIsWaiting = game.status === gameStatus.WAITING

        if (playerIsValid && hostIsWaiting) {

            let botUserAccounts = await fetchBotUserAccounts()
            let botUserAccount;
            while (game.privatePlayerList.length < 4) {
                botUserAccount = botUserAccounts.shift()
                if (botUserAccount) {
                    game.playerList.push(initializedPlayerListItem(botUserAccount));
                    game.privatePlayerList.push(initializedPrivatePlayerListItem(botUserAccount));
                }
            }

            for (let i = 0; i < 4; i++) {
                game.privatePlayerList[i].cards = arrayOfDealtCards[i];
                game.gameScores.push(
                    { roundNumber: 1, playerId: game.playerList[i].id, score: 0 }
                );
            }

            game.status = gameStatus.ACTIVE;
            game.currentTurn = game.playerList[1].id;
            game.playedHands = [[]];
            game.end = new Date();

            const savedGame = await game.save();

            res.status(200).json(gameResponse(userId, savedGame));
        } else {
            throw new CustomError('You cannot start this game.', 500);
        }
    } catch (err) {
        next(err);
    }
};

export default start;