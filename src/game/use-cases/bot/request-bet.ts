import Game, { gameStatus } from '../../game.model';
import CustomError from '../../../_helpers/custom-error';
import { RequestHandler } from 'express';
import gameResponse from '../../../_helpers/game-response';
import Bot from '../../../_entities/Bot';

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

        let botIndexPlayers = game.privatePlayerList.findIndex(x => String(x.id) === botId)
        const botCardsJson = game.privatePlayerList[botIndexPlayers].cards || []
        let bet = Bot.betFromAvailableCards(botCardsJson)

        let botIndexPlayerList = game.playerList.findIndex(x => String(x.id) === botId)
        if (game.playerList[botIndexPlayerList].betPlaced) {
            throw new CustomError('Bet cannot be placed more than once!', 500);
        }
        game.playerList[botIndexPlayerList].bet = bet;
        game.playerList[botIndexPlayerList].betPlaced = true
        // change the current turn to the next player

        // check if everyone has placed their bets
        const allBetsPlaced = game.playerList.filter(p => !p.betPlaced).length === 0;
        if (allBetsPlaced) {
            game.currentTurn = game.playerList[(game.roundNumber - 1) % 4].id;
        } else {
            game.currentTurn = game.playerList[(botIndexPlayerList + 1) % 4].id;
        }

        const savedGame = await game.save();
        res.status(200).json(gameResponse(userId, savedGame));

    } catch (err) {
        next(err);
    }
};

export default bet;