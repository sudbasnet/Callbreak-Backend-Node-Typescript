import Game, { gameStatus } from '../game.model';
import CustomError from '../../_helpers/custom-error';
import { RequestHandler } from 'express';
import socketIO from '../../socket';
import gameResponse from '../../_helpers/game-response';

const bet: RequestHandler = async (req, res, next) => {
    const userId = req.userId;
    const gameId = req.params.gameId;
    const bet: number = req.body.bet;

    if (!userId) {
        throw new CustomError('The user does not exist.', 404);
    }

    try {
        const game = await Game.findById(gameId);

        if (!game) {
            throw new CustomError('The game does not exist!', 404);
        }

        const isValidPlayer = game.players.map(x => x.id).includes(userId);
        if (!isValidPlayer) {
            throw new CustomError('Incorrect Game', 404);
        }

        if (bet > 13 || bet < 1) {
            throw new CustomError('Bet needs to be between 1 and 13', 500);
        }

        if (String(game.currentTurn) != String(userId)) {
            throw new CustomError('Not your turn to play!', 500);
        }

        if (game.status === gameStatus.ACTIVE) {
            let i = game.playerList.findIndex(x => String(x.id) === String(userId));

            if (game.playerList[i].betPlaced) {
                throw new CustomError('Bet cannot be changed once placed!', 500);
            }

            game.playerList[i].bet = bet;
            game.playerList[i].betPlaced = true;
            // change the current turn to the next player
            game.currentTurn = game.playerList[(i + 1) % 4].id;

            const savedGame = await game.save();

            socketIO.getIO().emit('bet', { bet: 'bets updated, refresh data' });

            res.status(200).json(gameResponse(userId, savedGame));
        } else {
            throw new CustomError('This game is no longer active!', 500);
        }
    } catch (err) {
        next(err);
    }
};

export default bet;