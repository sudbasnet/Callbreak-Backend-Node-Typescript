export interface Card {
    suit: string,
    value: string
};

export interface Hand {
    spades: string[],
    hearts: string[],
    clubs: string[],
    diamonds: string[]
};

class Deck {
    public static suites: string[] = ["hearts", "spades", "diamonds", "clubs"];
    public static faceCards: string[] = ["king", "queen", "jack", "ace"];
    public static numberCards: string[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10'];

    static getValue(card: Card): number {
        let cardValue: number;
        try {
            return +card.value;
        }
        catch (err) {
            if (card.value === 'jack') {
                return 11;
            } else if (card.value === 'queen') {
                return 12;
            } else if (card.value === 'king') {
                return 13;
            } else {
                return 14;
            }
        }
    }

    static getFullDeck() {
        let deck: Card[] = [];
        Deck.suites.forEach(suit => Deck.numberCards.forEach(numberCard => deck.push({ suit: suit, value: numberCard })));
        Deck.suites.forEach(suit => Deck.faceCards.forEach(faceCard => deck.push({ suit: suit, value: faceCard })));
        return deck;
    }

    static getRandomLocation(len: number) {
        return Math.floor(Math.random() * Math.floor(len));
    }

    static dealCards(numberOfCards: number, numberOfPlayers: number) {
        // eg: to deal 5 cards to 3 players, dealCards(5, 3)
        let deck = Deck.getFullDeck();
        let dealtCards: Hand[] = [];
        let i = 0;
        while (i < numberOfPlayers) {
            dealtCards.push({ spades: [], diamonds: [], clubs: [], hearts: [] });
            i++;
        }

        let cardsDealt = 0;
        let randomPosition = 0;
        let randomCard: Card;

        while (deck.length > 0 && cardsDealt < numberOfCards * numberOfPlayers) {
            randomPosition = Deck.getRandomLocation(deck.length);
            randomCard = deck[randomPosition];

            if (randomCard.suit === 'hearts') {
                dealtCards[cardsDealt % numberOfPlayers].hearts.push(randomCard.value);
            } else if (randomCard.suit === 'clubs') {
                dealtCards[cardsDealt % numberOfPlayers].clubs.push(randomCard.value);
            } else if (randomCard.suit === 'spades') {
                dealtCards[cardsDealt % numberOfPlayers].spades.push(randomCard.value);
            } else if (randomCard.suit === 'diamonds') {
                dealtCards[cardsDealt % numberOfPlayers].diamonds.push(randomCard.value);
            }

            deck.splice(randomPosition, 1); // remove 1 card from position "randomPosition"
            cardsDealt++;
        }

        return { dealt: dealtCards, remaining: deck };
    }
};

export default Deck;
