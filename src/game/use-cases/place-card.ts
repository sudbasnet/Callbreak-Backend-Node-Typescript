import Game from '../game.model'
import { RequestHandler } from 'express'
import CustomError from '../../_helpers/custom-error'

const placeCard: RequestHandler = async (req, res, next) => {
    const userId = req.userId
    const userName = req.userName
    const gameId = req.params.gameId
    const { suit, value, playedBy } = req.body.card

    if (!userId || !userName) {
        throw new CustomError('The user does not exist.', 404)
    }

    try {
        const game = await Game.findById(gameId)
        if (!game) {
            throw new CustomError('Cannot find game.', 404)
        }

        const playersIndex = game.privatePlayerList.findIndex(x => x.id === userId)
        const playerCards = game.privatePlayerList[playersIndex].cards
        const cardsOnTable = game.cardsOnTable

        if (playerCards) {
            const i = playerCards.findIndex(x => x.suit === suit && x.value === value)
            cardsOnTable.push(playerCards[i])
            playerCards.splice(i, 1)
        }

        await game.save()

        next()

    } catch (err) {
        next(err);
    }
};

export default placeCard;