import { ESuits } from '../enums/enums';

export default interface ICard {
    suit: ESuits;
    value: string;
    playedBy: string;
    numericValue(): number;
};