import { model, Schema, Document } from 'mongoose';
import { UserSchema } from '../user/user.model';
import { Card } from '../_entities/Deck';

export const enum gameStatus {
    "WAITING" = "waiting",
    "JOINING" = "joining",
    "ACTIVE" = "active",
    "INACTIVE" = "inactive"
};

export interface PlayerData {
    id: UserSchema['_id'];
    name?: string;
    bot: boolean;
    cards?: Card[];
    possibleMoves?: Card[];
};

export interface GameSchema extends Document {
    status: string;
    createdBy: UserSchema['_id'];

    gameNumber: number;
    roundNumber: number;

    playerList: {
        id: UserSchema['_id'],
        name: string,
        bot: boolean,
        bet: number,
        score: number,
        totalScore: number
        betPlaced: boolean
    }[];

    gameScores: {
        gameNumber: number,
        playerId: UserSchema['_id'],
        score: number
    }[];

    playedRounds: {
        won: boolean,
        card: Card
    }[][];

    cardsOnTable: Card[];
    currentTurn: UserSchema['_id'];

    currentSuit?: string;
    currentWinningCard?: Card;
    overriddenBySpade: boolean;

    gameType: string;
    start: Date;
    end?: Date;

    players: PlayerData[];
};

const Game: Schema = new Schema({
    status: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },

    gameNumber: { type: Number, default: 0 },
    roundNumber: { type: Number, default: 0 },

    playerList: {
        type: [
            {
                id: { type: Schema.Types.ObjectId, ref: 'User' },
                name: { type: String },
                bot: { type: Boolean },
                bet: { type: Number },
                score: { type: Number },
                totalScore: { type: Number },
                betPlaced: { type: Boolean, default: false },
            }
        ]
    },

    gameScores: {
        type: [{
            gameNumber: { type: Number },
            playerId: { type: Schema.Types.ObjectId, ref: 'User' },
            score: { type: Number }
        }]
    },
    playedRounds: {
        type: [
            [
                { won: { type: Boolean }, card: { type: { suit: { type: String }, value: { type: String } } } }
            ]
        ]
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
    end: { type: Date, required: false },

    players: {
        type: [
            {
                id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
                name: { type: String, required: false },
                bot: { type: Boolean, default: false },
                cards: { type: [{ suit: { type: String }, value: { type: String } }], required: false },
                possibleMoves: { type: [{ suit: { type: String }, value: { type: String } }], required: false }
            }
        ]
    }
});


export default model<GameSchema>('Game', Game);