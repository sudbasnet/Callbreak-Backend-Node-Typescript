import { model, Schema, Document } from 'mongoose';
import { UserSchema } from '../user/user.model';
import { Card } from '../_entities/Deck';

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
    currentWinningCard?: Card;
    overriddenBySpade: boolean;
};

export interface PlayerData {
    playerId: UserSchema['_id'];
    playerName: string;
    cards?: Card[];
    possibleMoves?: Card[];
};

export interface GameSchema extends Document {
    global: GlobalData;
    players: PlayerData[];
    status: gameStatus;
    playersReady: number;
    createdBy: UserSchema['_id'];
    gameType: string;
    start: Date;
    end?: Date;
};

const Game: Schema = new Schema({
    global: {
        type: {
            gameNumber: { type: Number, default: 0 },
            roundNumber: { type: Number, default: 0 },
            turnNumber: { type: Number, default: 0 },
            scores: {
                type: [{
                    playerId: { type: Schema.Types.ObjectId, ref: 'User' },
                    round: { type: Number },
                    score: { type: Number }
                }]
            },
            bets: {
                type: [{
                    playerId: { type: Schema.Types.ObjectId, ref: 'User' },
                    round: { type: Number },
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
            currentTurn: { type: Schema.Types.ObjectId, ref: 'User' },
            nextTurn: { type: Schema.Types.ObjectId, ref: 'User' },
            currentSuit: { type: String },
            currentWinningCard: { type: { suit: String, value: String } },
            overriddenBySpade: { type: Boolean, default: false }
        }
    },
    players: {
        type:
            [{
                playerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
                playerName: { type: String, required: true },
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

    status: { type: String },
    playersReady: { type: Number },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    gameType: { type: String },
    start: { type: Date },
    end: { type: Date, required: false }
});


export default model<GameSchema>('Game', Game);