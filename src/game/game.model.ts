import { model, Schema, Document } from 'mongoose';
import { UserSchema } from '../user/user.model';
import { Card } from '../_entities/Deck';

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
    cards?: Card[];
    possibleMoves?: Card[];
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
        bet?: number,
        score?: number,
        totalScore?: number
        betPlaced?: boolean
    }[];

    gameScores: {
        roundNumber: number,
        playerId: UserSchema['_id'],
        score: number
    }[];

    playedHands: Card[][];

    cardsOnTable: Card[];
    currentTurn: UserSchema['_id'];

    currentSuit?: string;
    currentWinningCard?: Card;
    overriddenBySpade: boolean;

    gameType: string;
    start: Date;
    end?: Date;

    privatePlayerList: PrivatePlayerList[];
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
        type: [[{ suit: { type: String }, value: { type: String } }]]
    },
    cardsOnTable: {
        type: [
            { suit: { type: String }, value: { type: String } }
        ]
    },

    currentTurn: { type: Schema.Types.ObjectId, ref: 'User' },
    currentSuit: { type: String, required: false },
    currentWinningCard: { type: { suit: { type: String }, value: { type: String } }, required: false },
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
                cards: { type: [{ suit: { type: String }, value: { type: String } }], default: [] },
                possibleMoves: { type: [{ suit: { type: String }, value: { type: String } }], default: [] }
            }
        ]
    }
});


export default model<GameSchema>('Game', Game);