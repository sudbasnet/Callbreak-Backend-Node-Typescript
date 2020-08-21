import { model, Schema, Document } from 'mongoose';
import { UserSchema } from '../user/user.model';
import { Card, Hand } from '../_entities/Deck';

export const enum gameStatus {
    "WAITING" = "waiting",
    "JOINING" = "joining",
    "DEALT" = "dealt",
    "ON" = "on",
    "COMPLETE" = "complete"
};

export interface GlobalData {
    gameNumber: number;
    roundNumber: number;
    turnNumber: number;
    scores: { round: number, playerId: UserSchema['_id'], score: number }[];
    bets: { round: number, playerId: UserSchema['_id'], bet: number }[];
    playedRounds: { playerId: string, card: Card }[][];
    currentTurn: UserSchema['_id'];
    nextTurn?: UserSchema['_id'];
    currentSuit?: string;
    overriddenBySpade?: boolean;
};

export interface PlayerData {
    playerId: UserSchema['_id'];
    cards?: Hand;
    possibleMoves?: Card[];
};

export interface LogData {
    status: gameStatus;
    playersReady: number;
    createdBy: UserSchema['_id'];
    gameType: string;
    players: UserSchema['_id'][];
    start: Date;
    end?: Date;
};

export interface GameSchema extends Document {
    global: GlobalData;
    players: PlayerData[];
    log: LogData;
};

const Game: Schema = new Schema({
    global: {
        type: {
            gameNumber: { type: Number, default: 0 },
            roundNumber: { type: Number, default: 0 },
            turnNumber: { type: Number, default: 0 },
            scores: {
                type: [{
                    round: { type: Number },
                    playerId: { type: Schema.Types.ObjectId, ref: 'User' },
                    score: { type: Number }
                }]
            },
            bets: {
                type: [{
                    round: { type: Number },
                    playerId: { type: Schema.Types.ObjectId, ref: 'User' },
                    bet: { type: Number }
                }]
            },
            playedRounds: {
                type:
                    [[{
                        playerId: { type: Schema.Types.ObjectId, ref: 'User' },
                        card: {
                            type:
                            {
                                suit: String,
                                value: String
                            }
                        }
                    }]]
            },
            currentTurn: { type: Schema.Types.ObjectId, ref: 'User', required: false },
            nextTurn: { type: Schema.Types.ObjectId, ref: 'User', required: false },
            currentSuit: { type: String, required: false },
            overriddenBySpade: { type: Boolean, default: false }
        }
    },
    players: {
        type:
            [{
                playerId: { type: Schema.Types.ObjectId, ref: 'User' },
                cards: {
                    type:
                        [{
                            suit: String,
                            value: String
                        }]
                },
                possibleMoves: {
                    type:
                        [{
                            suit: String,
                            value: String
                        }]
                }
            }]
    },
    log: {
        type:
        {
            status: { type: String },
            playersReady: { type: Number },
            createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
            gameType: { type: String },
            players: [{ type: Schema.Types.ObjectId, ref: 'User' }],
            start: { type: Date },
            end: { type: Date, required: false }
        }
    }
});


export default model<GameSchema>('Game', Game);