import Game from '../game.model';
import { Card } from '../../_entities/Deck';
import CustomError from '../../_helpers/custom-error';
import { RequestHandler } from 'express';
import gameResponse from '../../_helpers/game-response';

const validMoves: RequestHandler = async (req, res, next) => {
    const userId = req.userId;
    const gameId = req.params.gameId;
    const currentPlayer = req.body.nextPlayer;

    if (!userId) {
        throw new CustomError('The user does not exist.', 404);
    }
    try {
        const game = await Game.findById(gameId);

        if (!game) {
            throw new CustomError('The game does not exist.', 404);
        }

        if (userId != currentPlayer) {
            next();
        }

        const currentPlayerIndex = game.players.findIndex(x => x.id === userId);
        let player = game.players[currentPlayerIndex];

        if (!player.cards) {
            throw new CustomError('No cards available for the player.', 500);
        }

        let possibleMoves: Card[] = player.cards;

        if (game.currentSuit && game.currentWinningCard) {
            const currentSuit = game.currentSuit;
            const currentWinningCard = game.currentWinningCard;
            const overriddenBySpade = game.overriddenBySpade;

            if (!overriddenBySpade) {
                possibleMoves = player.cards.filter(x => x.suit === currentWinningCard.suit && x.numericValue() > currentWinningCard.numericValue());
                if (possibleMoves?.length === 0) {
                    // means we do not have a card of the same suit that can win
                    possibleMoves = player.cards.filter(x => x.suit === currentWinningCard.suit);

                    if (possibleMoves?.length === 0) {
                        // means we do not even have anything of the same suit
                        possibleMoves = player.cards.filter(x => x.suit === 'spades');

                        if (possibleMoves?.length === 0) {
                            // means we dont have any spades either
                            possibleMoves = player.cards;
                        }
                    }
                }
            } else {
                possibleMoves = player.cards.filter(x => x.suit === currentSuit);
                if (possibleMoves.length === 0) {
                    // means we dont have card of original suit
                    possibleMoves = player.cards.filter(x => x.suit === currentWinningCard.suit && x.numericValue() > currentWinningCard.numericValue());

                    if (possibleMoves.length === 0) {
                        // means we can't win
                        possibleMoves = player.cards;
                    }
                }
            }
        }
        game.players[currentPlayerIndex].possibleMoves = possibleMoves;
        const savedGame = await game.save();

        res.status(200).json(gameResponse(userId, savedGame));
    } catch (err) {
        next(err);
    }
};

export default validMoves;