import CustomError from "../_helpers/custom-error";
import Deck, { Card, suits } from './Deck';

const getHighestValueCard = (cards: Card[], ignoreSuit = true) => {
    let highestCard = cards[0]
    if (ignoreSuit) {
        cards.forEach(card => {
            console.log(card)
            console.log(`num: ${card.numericValue()}`)
            if (card.numericValue() > highestCard.numericValue()) {
                highestCard = card
            }
        })
    } else {
        // should not be used
        cards.forEach(card => {
            if (card.suit === highestCard.suit && card.numericValue() > highestCard.numericValue()) {
                highestCard = card
            } else if (card.suit === suits.SPADES && highestCard.suit != suits.SPADES) {
                highestCard = card
            }
        })
    }
    return highestCard
}

const getLowestValueCard = (cards: Card[], ignoreSuit = true) => {
    let lowestCard = cards[0]
    if (ignoreSuit) {
        cards.forEach(card => {
            if (card.numericValue() < lowestCard.numericValue()) {
                lowestCard = card
            }
        })
    } else {
        // should not be used
        cards.forEach(card => {
            if (card.suit === lowestCard.suit && card.numericValue() < lowestCard.numericValue()) {
                lowestCard = card
            } else if (card.suit != suits.SPADES && lowestCard.suit === suits.SPADES) {
                lowestCard = card
            }
        })
    }
    return lowestCard
}

export default class Bot {

    public static betFromAvailableCards(cards: Card[]) {
        // things to know:
        // number of Aces
        // number of Aces + Kings
        // number of Kings + Queens
        // min number of cards from same suit
        // max number of cards from same suit
        // number of spades
        const numberOfSpades = cards.filter(x => x.suit === 'spades').length
        const numberOfAces = cards.filter(x => x.value === 'ace').length
        const numberOfKings = cards.filter(x => x.value === 'king').length
        return Math.max(numberOfAces + numberOfKings, 1)
    }

    public static makeMove(cards: Card[], currentSuit: string, winningCard: Card | null): Card {
        cards = cards.map(c => new Card(c.suit, c.value, c.playedBy))
        if (winningCard) {
            winningCard = new Card(winningCard?.suit, winningCard?.value, winningCard?.playedBy)
        }


        if (!winningCard) {
            return cards[0]
        }

        const cardsOfCurrentSuit = cards.filter(c => c.suit === currentSuit)
        const cardsOfSpades = cards.filter(c => c.suit === suits.SPADES)
        const otherCards = cards.filter(c => c.suit != currentSuit && c.suit != suits.SPADES)

        if (currentSuit === winningCard.suit) {
            // not overridden by spades
            if (cardsOfCurrentSuit.length > 0) {
                const highestOfCurrentSuit = getHighestValueCard(cardsOfCurrentSuit)
                if (highestOfCurrentSuit.numericValue() > winningCard.numericValue()) {
                    return highestOfCurrentSuit
                } else {
                    return getLowestValueCard(cardsOfCurrentSuit)
                }
            } else if (cardsOfSpades.length > 0) {
                return getLowestValueCard(cardsOfSpades)
            } else {
                return getLowestValueCard(otherCards)
            }
        } else {
            if (cardsOfCurrentSuit.length > 0) {
                return getLowestValueCard(cardsOfCurrentSuit)
            } else if (cardsOfSpades.length > 0) {
                const highestOfSpades = getHighestValueCard(cardsOfSpades)
                if (highestOfSpades.numericValue() > winningCard.numericValue()) {
                    return highestOfSpades
                } else {
                    return getLowestValueCard(otherCards)
                }
            } else {
                return getLowestValueCard(otherCards)
            }
        }
    }
};
