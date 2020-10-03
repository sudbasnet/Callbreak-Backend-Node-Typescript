import Game from '../game.model';
import CustomError from '../../entities/classes/CustomError';
import { RequestHandler } from 'express';
import gameResponse from '../../helpers/game-response';

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

        if (bet > 13 || bet < 1) {
            throw new CustomError('Bet needs to be between 1 and 13', 500);
        }

        let i = game.playerList.findIndex(x => String(x.id) === String(userId));
        if (game.playerList[i].betPlaced) {
            throw new CustomError('Bet cannot be changed once placed!', 500);
        }

        game.playerList[i].bet = bet;
        game.playerList[i].betPlaced = true;

        // check if everyone has placed their bets
        const allBetsPlaced = game.playerList.filter(p => !p.betPlaced).length === 0;
        if (allBetsPlaced) {
            game.currentTurn = game.playerList[(game.roundNumber - 1) % 4].id;
        } else {
            game.currentTurn = game.playerList[(i + 1) % 4].id;
        }

        const savedGame = await game.save();
        res.status(200).json(gameResponse(userId, savedGame));
    } catch (err) {
        next(err);
    }
};

export default bet;