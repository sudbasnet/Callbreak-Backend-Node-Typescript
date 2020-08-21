import Game, { gameStatus } from '../../game.model';
import Deck from '../../../_entities/Deck';
import CustomError from '../../../_helpers/custom-error';
import { RequestHandler } from 'express';

const start: RequestHandler = async (req, res, next) => {
    const userId = req.userId;
    const gameType = req.params.gameType;
    const gameId = req.params.gameId;

    const dealtCardsObject = Deck.dealCards(13, 4); //dealing 13 cards to 4 players
    const remainingCards = dealtCardsObject.remaining;

    try {
        const game = await Game.findById(gameId);

        if (!game) {
            throw new CustomError('The game does not exist.', 404);
        }

        const isValidPlayer = game.players.map(x => x.playerId).includes(userId);

        if (isValidPlayer && game.log.status == gameStatus.WAITING) {
            while (game.players.length < 4) {
                game.players.push({ playerId: "bot-" + game.players.length });
            }
            for (let i = 0; i < 4; i++) {
                game.players[i].cards = dealtCardsObject.dealt[i];
                game.global.scores.push(
                    {
                        round: 0,
                        playerId: game.players[i].playerId,
                        score: 0
                    }
                );
                game.global.bets.push(
                    {
                        round: 0,
                        playerId: game.players[i].playerId,
                        bet: 0
                    }
                );
            }

            game.global.playedRounds = [[]];
            game.global.nextTurn = userId;

            game.log.status = gameStatus.DEALT;
            game.log.end = new Date();

            const savedGame = await game.save();
            res.status(200).json(savedGame);
        } else {
            throw new CustomError('You cannot start this game.', 500);
        }
    } catch (err) {
        next(err);
    }
}