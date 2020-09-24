import Game, { gameStatus } from '../../game.model';
import CustomError from '../../../_helpers/custom-error';
import { RequestHandler } from 'express';
import gameResponse from '../../../_helpers/game-response';
import Bot from '../../../_entities/Bot';
import placeCard from '../process-move';
import Deck, { suits } from '../../../_entities/Deck';

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

        if (game.status === gameStatus.ACTIVE) {
            // Bot.makeMove()
            const privatePlayersIndex = game.privatePlayerList.findIndex(x => String(x.id) === botId);
            const botCards = game.privatePlayerList[privatePlayersIndex].cards || [];

            let playedCard = Bot.makeMove(botCards, String(game.currentSuit), game.currentWinningCard || null);

            req.body.suit = playedCard.suit;
            req.body.value = playedCard.value;
            req.body.playedBy = botId;

            next();
        } else {
            throw new CustomError('This game is no longer active!', 500);
        }
    } catch (err) {
        next(err);
    }
};

export default botMove;