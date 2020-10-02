import Game, { IGameSchema } from '../game.model';
import { RequestHandler } from 'express';
import User from '../../user/user.model';
import CustomError from '../../entities/classes/CustomError';
import gameResponse from '../helpers/game-response';
import ICard from '../../entities/interfaces/ICard';
import { ESuits, gameStatus } from '../../entities/enums/enums';
import Deck from '../../entities/classes/Deck';


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

        let game: IGameSchema;
        const allActiveGames = await Game.find({ status: { $ne: gameStatus.INACTIVE } });
        const gamesWithUser = allActiveGames.filter(g => g.playerList.map(p => String(p.id)).includes(userId));
        if (gamesWithUser.length > 0) {
            game = gamesWithUser[0];
            if (String(game.currentTurn) === userId) {
                const i = game.privatePlayerList.findIndex(p => String(p.id) === userId);
                const privatePlayer = game.privatePlayerList[i];
                game.privatePlayerList[i].possibleMoves = getPossibleMoves(privatePlayer.cards, game.currentWinningCard, game.currentSuit);
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

// helper method
const getPossibleMoves = (
    cards: ICard[],
    currentWinner: ICard | undefined,
    currentSuit: ESuits | undefined
) => {
    const possibleMoves: ICard[] = [];
    if (cards && currentWinner && currentSuit) {
        let winner: ICard;
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

export default gameData;