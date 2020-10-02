import { ESuits } from '../enums/enums';
import ICard from '../interfaces/ICard';

export default class Card implements ICard {
    constructor(
        public suit: ESuits,
        public value: string,
        public playedBy: string = ''
    ) { }

    numericValue(): number {
        let num: number;
        try {
            if (this.value === 'jack') {
                num = 11;
            } else if (this.value === 'queen') {
                num = 12;
            } else if (this.value === 'king') {
                num = 13;
            } else if (this.value === 'ace') {
                num = 14
            } else {
                num = +this.value
            }
        } catch (err) {
            throw new Error(err.message);
        }
        return num
    }
}