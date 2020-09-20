import CustomError from "../_helpers/custom-error";
import Deck, { Card } from './Deck';

export default class Bot {

    static cardsJsonToClass(cardJsonObjects: { suit: string, value: string }[]): Card[] {
        const cards: Card[] = [];
        cardJsonObjects.forEach(cardJsonObject => {
            cards.push(new Card(cardJsonObject.suit, cardJsonObject.value))
        })
        return cards
    }

    static betFromCards(cards: Card[]) {
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

    static betFromCardsJson(cardJsonObjects: { suit: string, value: string }[]) {
        const cardsClass = Bot.cardsJsonToClass(cardJsonObjects)
        const bet = Bot.betFromCards(cardsClass)
        return bet
    }

    static makeMove(cards: Card[]) {

    }
};
