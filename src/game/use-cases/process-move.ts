import Game from '../game.model'
import { RequestHandler } from 'express'
import CustomError from '../../_helpers/custom-error'
import Deck, { suits } from '../../_entities/Deck';
import { ADDRGETNETWORKPARAMS } from 'dns';

const placeCard: RequestHandler = async (req, res, next) => {
    const userId = req.userId
    const userName = req.userName
    const gameId = req.params.gameId
    const { suit, value, playedBy } = req.body

    if (!userId || !userName) {
        throw new CustomError('The user does not exist.', 404)
    }

    try {
        const game = await Game.findById(gameId)
        if (!game) {
            throw new CustomError('Cannot find game.', 404)
        }

        if (String(game.currentTurn) != userId) {
            throw new CustomError('Not your turn.', 500)
        }

        const playersIndex = game.privatePlayerList.findIndex(x => String(x.id) === userId)
        const playerCards = game.privatePlayerList[playersIndex].cards
        let cardsOnTable = game.cardsOnTable

        if (cardsOnTable.length === 4) {
            cardsOnTable = []
        }

        if (playerCards) {
            const i = playerCards.findIndex(x => x.suit === suit && x.value === value)
            playerCards[i].playedBy = playedBy
            cardsOnTable.push(playerCards[i])

            if (suit === suits.SPADES && game.currentSuit != suit) {
                game.overriddenBySpade = true
            }

            if (game.currentWinningCard && game.currentSuit) {
                game.currentWinningCard = Deck.calculateCallbreakWinner(game.currentWinningCard, playerCards[i], game.currentSuit)
            } else {
                game.currentWinningCard = playerCards[i]
                game.currentSuit = suit
            }

            playerCards.splice(i, 1)
        }

        game.privatePlayerList[playersIndex].possibleMoves = []
        game.markModified('privatePlayerList')

        await game.save()
        next()

    } catch (err) {
        next(err);
    }
};

export default placeCard;