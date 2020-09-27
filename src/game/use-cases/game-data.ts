import Game, { GameSchema, gameStatus } from '../game.model';
import { RequestHandler } from 'express';
import User from '../../user/user.model';
import CustomError from '../../_helpers/custom-error';
import gameResponse from '../../_helpers/game-response';
import Deck, { Card, suits } from '../../_entities/Deck';

const getPossibleMoves = (cards: Card[], currentWinner: Card | undefined, currentSuit: suits | undefined) => {
    const possibleMoves: Card[] = [];
    if (cards && currentWinner && currentSuit) {
        let winner: Card;
        cards.forEach(card => {
            winner = Deck.calculateCallbreakWinner(currentWinner, card, currentSuit);
            if (currentWinner.suit != winner.suit || currentWinner.value != winner.value) {
                possibleMoves.push(winner);
            }
        });
    } else {
        return cards;
    }
    return possibleMoves;
}


const gameData: RequestHandler = async (req, res, next) => {
    const userId = req.userId;
    if (!userId) {
        throw new CustomError('The user does not exist.', 404);
    }
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new CustomError('Invalid Request', 404);
        }

        let game: GameSchema;
        const allActiveGames = await Game.find({ status: { $ne: gameStatus.INACTIVE } });
        const incompleteGames = allActiveGames.filter(g => g.playerList.map(p => String(p.id)).includes(userId));
        if (incompleteGames.length > 0) {
            game = incompleteGames[0];

            if (String(game.currentTurn) === userId) {
                const index = game.privatePlayerList.findIndex(p => String(p.id) === userId);
                const privatePlayer = game.privatePlayerList[index];
                game.privatePlayerList[index].possibleMoves = getPossibleMoves(privatePlayer.cards, game.currentWinningCard, game.currentSuit);
                const savedGame = await game.save();

                res.status(200).json(gameResponse(userId, savedGame));
            } else {
                res.status(200).json(gameResponse(userId, game));
            }
        } else {
            throw new CustomError('The current user has no pre-existing game', 404);
        }
    } catch (err) {
        next(err);
    }
};

export default gameData;