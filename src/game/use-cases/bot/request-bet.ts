import Game from '../../game.model';
import CustomError from '../../../lib/classes/CustomError';
import { RequestHandler } from 'express';
import gameResponse from '../../helpers/game-response';
import CallbreakBot from '../../../lib/classes/CallbreakBot';
import ICard from '../../../lib/interfaces/ICard';

const bet: RequestHandler = async (req, res, next) => {
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

        const i = game.privatePlayerList.findIndex(x => String(x.id) === botId);
        const botCards: ICard[] = game.privatePlayerList[i].cards || [];
        const bet = CallbreakBot.betFromAvailableCards(botCards);

        const j = game.playerList.findIndex(x => String(x.id) === botId)
        if (game.playerList[j].betPlaced) {
            throw new CustomError('Bet cannot be placed more than once!', 500);
        }
        game.playerList[j].bet = bet;
        game.playerList[j].betPlaced = true
        // change the current turn to the next player

        // check if everyone has placed their bets
        const allBetsPlaced = game.playerList.filter(p => !p.betPlaced).length === 0;
        if (allBetsPlaced) {
            game.currentTurn = game.playerList[(game.roundNumber - 1) % 4].id;
        } else {
            game.currentTurn = game.playerList[(j + 1) % 4].id;
        }

        const savedGame = await game.save();
        res.status(200).json(gameResponse(userId, savedGame));

    } catch (err) {
        next(err);
    }
};

export default bet;