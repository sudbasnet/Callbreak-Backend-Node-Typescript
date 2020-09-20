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

        if (String(game.createdBy) != userId) {
            next();
        }

        if (String(game.currentTurn) != botId) {
            throw new CustomError('Not bot turn to play!', 500);
        }

        if (game.status === gameStatus.ACTIVE) {
            let botIndexPlayers = game.players.findIndex(x => String(x.id) === botId)
            const botCardsJson = game.players[botIndexPlayers].cards || []
            let bet = Bot.betFromCards(botCardsJson)

            let botIndexPlayerList = game.playerList.findIndex(x => String(x.id) === botId)
            if (game.playerList[botIndexPlayerList].betPlaced) {
                throw new CustomError('Bet cannot be placed more than once!', 500);
            }
            game.playerList[botIndexPlayerList].bet = bet;
            game.playerList[botIndexPlayerList].betPlaced = true
            // change the current turn to the next player
            game.currentTurn = game.playerList[(botIndexPlayerList + 1) % 4].id;

            const savedGame = await game.save();

            res.status(200).json(gameResponse(userId, savedGame));
        } else {
            throw new CustomError('This game is no longer active!', 500);
        }

    } catch (err) {
        next(err);
    }
};

export default bet;