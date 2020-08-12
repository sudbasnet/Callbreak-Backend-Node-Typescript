import Game, { Player } from '../../game.model';
import Deck from '../../../_entities/Deck';
import CustomError from '../../../_helpers/custom-error';
import { RequestHandler } from 'express';

const start: RequestHandler = async (req, res, next) => {
    const userId = req.userId;
    const gameType = req.params.gameType;
    const gameId = req.params.gameId;

    const deck = new Deck();
    const dealtCardsObject = deck.dealCards(13, 4); //dealing 13 cards to 4 players
    const remainingCards = dealtCardsObject.remaining;

    try {
        const game = await Game.findById(gameId);

        if (!game) {
            throw new CustomError('The game does not exist.', 404);
        }

        const isValidPlayer = game.players.map(x => x.userId).includes(userId);
        const botPlayer: Player = {
            userType: 'bot',
            userId: userId,
            order: 99
        };

        if (isValidPlayer && game.status == 'waiting') {
            while (game.players.length < 4) {
                game.players.push(botPlayer);
            }
            for (let i = 0; i < 4; i++) {
                game.players[i].cards = dealtCardsObject.dealt[i];
            }

            game.status = 'on';
            game.gameNumber = 1;
            game.round = {
                num: 1, // starts as round 1
                starterSuit: '', // not thrown yet, so we dont know
                starterPlayer: null,
                playedTheirHands: [],
                overriddenBySpade: false, // is the turn overridden by a spade?
                cardsOnTheTable: [], // None at the start of the game
                turn: 1, // first turn
                nextPlayer: 0, // players.order
                winningThisTurn: null
            };
            game.end = new Date(); // gets updated at the end of each turn

            const savedGame = await game.save();
            res.status(200).json(savedGame);
        } else {
            throw new CustomError('You cannot start this game.', 500);
        }
    } catch (err) {
        next(err);
    }
}