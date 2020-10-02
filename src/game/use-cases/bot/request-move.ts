import Game from '../../game.model';
import CustomError from '../../../lib/classes/CustomError';
import { RequestHandler } from 'express';
import CallbreakBot from '../../../lib/classes/CallbreakBot';
import ICard from '../../../lib/interfaces/ICard';

const botMove: RequestHandler = async (req, res, next) => {
    const userId = req.userId;
    const gameId = req.params.gameId;
    const botId = req.params.botId;

    if (!userId) {
        throw new CustomError('The user does not exist.', 404);
    }

    try {
        const game = await Game.findById(gameId);
        if (!game) {
            throw new CustomError('The game does not exist!', 404);
        }

        // Bot.makeMove()
        const privatePlayersIndex = game.privatePlayerList.findIndex(x => String(x.id) === botId);
        const botCards: ICard[] = game.privatePlayerList[privatePlayersIndex].cards || [];

        let playedCard = CallbreakBot.makeMove(botCards, String(game.currentSuit), game.currentWinningCard || null);

        req.body.suit = playedCard.suit;
        req.body.value = playedCard.value;
        req.body.playedBy = botId;

        next();
    } catch (err) {
        next(err);
    }
};

export default botMove;