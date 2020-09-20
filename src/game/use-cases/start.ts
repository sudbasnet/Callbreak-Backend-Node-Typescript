import Game, { gameStatus } from '../game.model';
import User, { UserSchema } from '../../user/user.model';
import Deck from '../../_entities/Deck';
import CustomError from '../../_helpers/custom-error';
import { RequestHandler } from 'express';
import gameResponse from '../../_helpers/game-response';

const start: RequestHandler = async (req, res, next) => {
    const userId = req.userId;
    const gameId = req.params.gameId;

    const dealtCardsObject = Deck.dealCards(13, 4);

    if (!userId) {
        throw new CustomError('The user does not exist.', 404);
    }

    try {
        const game = await Game.findById(gameId);

        if (!game) {
            throw new CustomError('The game does not exist.', 404);
        }

        const isValidPlayer = game.players.map(x => x.id).includes(userId);

        if (isValidPlayer && game.status === gameStatus.WAITING) {
            let bots: UserSchema[] = [];
            if (game.players.length < 4) {
                bots = await User.find({ role: 'bot' });
            }
            while (game.players.length < 4) {
                game.playerList.push({
                    id: bots[3 - game.players.length]._id,
                    name: bots[3 - game.players.length].name,
                    bet: 0,
                    bot: true,
                    score: 0,
                    totalScore: 0,
                    betPlaced: false
                });
                game.players.push({
                    id: bots[3 - game.players.length]._id,
                    name: bots[3 - game.players.length].name,
                    bot: true,
                    cards: [],
                    possibleMoves: []
                });
            }

            for (let i = 0; i < 4; i++) {
                game.players[i].cards = dealtCardsObject.dealt[i];
                game.gameScores.push(
                    {
                        gameNumber: 0,
                        playerId: game.players[i].id,
                        score: 0
                    }
                );
            }

            game.playedRounds = [[]];

            game.status = gameStatus.ACTIVE;
            game.end = new Date();
            game.currentTurn = game.playerList[1].id;

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