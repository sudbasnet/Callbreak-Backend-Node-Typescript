import ICard from "./ICard";

export default interface IDealtCards {
    arrayOfDealtCards: ICard[][],
    remainingCards: ICard[]
}