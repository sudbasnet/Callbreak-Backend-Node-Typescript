import CustomError from "../_helpers/custom-error";

export const enum suits {
    SPADES = 'spades',
    HEARTS = "hearts",
    DIAMONDS = 'diamonds',
    CLUBS = "clubs"
};

export const enum facecardValues {
    JACK = 11,
    KING = 12,
    QUEEN = 13,
    ACE = 14
};

export class Card {
    constructor(public suit: string, public value: string, public playedBy: string = '') { }

    public numericValue(): number {
        try {
            return + this.value;
        }
        catch (err) {
            if (this.value === 'jack') {
                return facecardValues.JACK;
            } else if (this.value === 'queen') {
                return facecardValues.QUEEN;
            } else if (this.value === 'king') {
                return facecardValues.KING;
            } else if (this.value === 'ace')
                return facecardValues.ACE;
        }
        throw new CustomError('Invalid value of card.', 500);
    }
}

export default class Deck {
    public static suites: suits[] = [suits.HEARTS, suits.SPADES, suits.DIAMONDS, suits.CLUBS];
    public static cardValues: string[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', "ace", "king", "queen", "jack"];

    public static getFullCardDeck() {
        let deck: Card[] = [];
        Deck.suites.forEach(suit => Deck.cardValues.forEach(cardValue => deck.push(new Card(suit, cardValue))));
        return deck;
    }

    static getRandomLocation(len: number) {
        return Math.floor(Math.random() * Math.floor(len));
    }

    public static dealCards(numberOfCards: number, numberOfPlayers: number) {
        // eg: to deal 5 cards to 3 players, dealCards(5, 3)
        let deck = Deck.getFullCardDeck();
        let dealtCards: Card[][] = [];
        let i = 0;
        while (i < numberOfPlayers) {
            dealtCards.push([]);
            i++;
        }

        let cardsDealt = 0;
        let randomPosition = 0;
        let randomCard: Card;

        while (deck.length > 0 && cardsDealt < numberOfCards * numberOfPlayers) {
            randomPosition = Deck.getRandomLocation(deck.length);
            randomCard = deck[randomPosition];
            dealtCards[cardsDealt % numberOfPlayers].push(randomCard);
            deck.splice(randomPosition, 1); // remove 1 card from position "randomPosition"
            cardsDealt++;
        }

        return { arrayOfDealtCards: dealtCards, remainingCards: deck };
    }

    public static calculateCallbreakWinner(cardA: Card, cardB: Card, playingSuit: suits): Card {
        if (cardA.suit === cardB.suit) {
            return cardA.numericValue() > cardB.numericValue() ? cardA : cardB
        } else if (cardA.suit === suits.SPADES) {
            return cardA
        } else if (cardB.suit === suits.SPADES) {
            return cardB
        } else if (cardA.suit === playingSuit) {
            return cardA
        } else {
            return cardB
        }
    };
};
