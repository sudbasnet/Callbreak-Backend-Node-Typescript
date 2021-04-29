import { ESuits } from "../enums/enums";
import ICard from "./ICard";
import { IUserModel } from "./IUserModel";

export interface IPrivatePlayer<userIdType> {
    id: userIdType;
    name?: string;
    bot: boolean;
    cards: ICard[];
    possibleMoves: ICard[];
};

export interface IPlayer<userIdType> {
    id: userIdType,
    name: string,
    bot: boolean,
    bet: number,
    score: number,
    ots: number,
    totalScore: number
    betPlaced: boolean
};

export interface IGameScore<userIdType> {
    roundNumber: number,
    id: userIdType,
    score: number
};

export default interface IGameModel<gameIdType, userIdType> {
    _id: gameIdType;
    status: string;
    createdBy: userIdType;
    roundNumber: number;
    handNumber: number;
    playerList: IPlayer<userIdType>[],
    gameScores: IGameScore<userIdType>[];
    playedHands: ICard[][];
    cardsOnTable: ICard[];
    currentTurn: userIdType;
    currentSuit?: ESuits;
    currentWinningCard?: ICard;
    overriddenBySpade: boolean;
    gameType: string;
    start: Date;
    end?: Date;
    privatePlayerList: IPrivatePlayer<userIdType>[];

    addUserToGame(user: IUserModel<userIdType>): void;
};

export function initializedPrivatePlayerListItem<T>(user: IUserModel<T>) {
    return {
        id: user._id,
        name: user.name,
        bot: user.role === 'bot' ? true : false,
        cards: [],
        possibleMoves: []
    };
};

export function initializedPlayerListItem<T>(user: IUserModel<T>) {
    return {
        id: user._id,
        name: user.name,
        bot: user.role === 'bot' ? true : false,
        bet: 1,
        score: 0,
        ots: 0,
        totalScore: 0,
        betPlaced: false
    };
};

export function initializedGameScoresItem<T>(userId: T) {
    return {
        roundNumber: 1,
        id: userId,
        score: 0
    };
};