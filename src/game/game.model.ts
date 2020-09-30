import { model, Schema, Document } from 'mongoose';
import { UserSchema } from '../user/user.model';
import { Card, suits } from '../_entities/Deck';

export const enum gameStatus {
    "WAITING" = "waiting",
    "JOINING" = "joining",
    "ACTIVE" = "active",
    "INACTIVE" = "inactive"
};

export interface PrivatePlayerList {
    id: UserSchema['_id'];
    name?: string;
    bot: boolean;
    cards: Card[];
    possibleMoves: Card[];
};

export interface GameSchema extends Document {
    status: string;
    createdBy: UserSchema['_id'];

    roundNumber: number;
    handNumber: number;

    playerList: {
        id: UserSchema['_id'],
        name: string,
        bot: boolean,
        bet: number,
        score: number,
        ots: number,
        totalScore: number
        betPlaced: boolean
    }[];

    gameScores: {
        roundNumber: number,
        playerId: UserSchema['_id'],
        score: number
    }[];

    playedHands: Card[][];

    cardsOnTable: Card[];
    currentTurn: UserSchema['_id'];

    currentSuit?: suits;
    currentWinningCard?: Card;
    overriddenBySpade: boolean;

    gameType: string;
    start: Date;
    end?: Date;

    privatePlayerList: PrivatePlayerList[];

    addUserToGame(user: UserSchema): void;
};


export const initializedPrivatePlayerListItem = (user: UserSchema) => {
    return {
        id: user._id,
        name: user.name,
        bot: user.role === 'bot' ? true : false,
        cards: [],
        possibleMoves: []
    };
};

export const initializedGameScoresItem = (userId: string) => {
    return {
        roundNumber: 1,
        playerId: userId,
        score: 0
    };
};

export const initializedPlayerListItem = (user: UserSchema) => {
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

const Game: Schema = new Schema({
    status: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },

    roundNumber: { type: Number, default: 0 },
    handNumber: { type: Number, default: 0 },

    playerList: {
        type: [
            {
                id: { type: Schema.Types.ObjectId, ref: 'User' },
                name: { type: String },
                bot: { type: Boolean, required: true },
                bet: { type: Number, default: 0 },
                score: { type: Number, default: 0 },
                ots: { type: Number, default: 0 },
                totalScore: { type: Number, default: 0 },
                betPlaced: { type: Boolean, default: false },
            }
        ]
    },

    gameScores: {
        type: [{
            roundNumber: { type: Number },
            playerId: { type: Schema.Types.ObjectId, ref: 'User' },
            score: { type: Number }
        }]
    },
    playedHands: {
        type: [[{ suit: { type: String }, value: { type: String }, playedBy: { type: String } }]]
    },
    cardsOnTable: {
        type: [
            { suit: { type: String }, value: { type: String }, playedBy: { type: String } }
        ]
    },

    currentTurn: { type: Schema.Types.ObjectId, ref: 'User' },
    currentSuit: { type: String, required: false },
    currentWinningCard: { type: { suit: { type: String }, value: { type: String }, playedBy: { type: String } }, required: false },
    overriddenBySpade: { type: Boolean, default: false },

    gameType: { type: String },
    start: { type: Date },
    end: { type: Date },

    privatePlayerList: {
        type: [
            {
                id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
                name: { type: String },
                bot: { type: Boolean, default: false },
                cards: { type: [{ suit: { type: String }, value: { type: String }, playedBy: { type: String } }], default: [] },
                possibleMoves: { type: [{ suit: { type: String }, value: { type: String }, playedBy: { type: String } }], default: [] }
            }
        ]
    }
});

Game.methods = {
    addUserToGame(user: UserSchema) {
        this.playerList.push(initializedPlayerListItem(user));
        this.privatePlayerList.push(initializedPrivatePlayerListItem(user));
        this.gameScores.push(initializedGameScoresItem(user._id));
    }
};

Game.statics = {};

export default model<GameSchema>('Game', Game);