import CustomError from "../_helpers/custom-error";
import Deck, { Card } from './Deck';

export default class Bot {
    static makeCardsFromStrings(cardsFromResponse: { suit: string, value: string }[]): Card[] {
        const cards: Card[] = [];
        cardsFromResponse.forEach(cardFromResponse => {
            cards.push(new Card(cardFromResponse.suit, cardFromResponse.value))
        })
        return cards
    }

    static getBet(cards: Card[]) {
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
        return numberOfAces + numberOfKings
    }
};
