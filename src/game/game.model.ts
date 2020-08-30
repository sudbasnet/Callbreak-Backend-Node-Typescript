import { model, Schema, Document } from 'mongoose';
import { UserSchema } from '../user/user.model';
import { Card } from '../_entities/Deck';

export const enum gameStatus {
    "WAITING" = "waiting",
    "JOINING" = "joining",
    "ACTIVE" = "active",
    "INACTIVE" = "inactive"
};

export interface GlobalData {
    gameNumber: number;
    roundNumber: number;
    turnNumber: number;
    playerList: { playerId: UserSchema['_id'], playerName: string }[];
    scores: { round: number, playerId: UserSchema['_id'], score: number }[];
    bets: { round: number, playerId: UserSchema['_id'], bet: number }[];
    ready: { player: UserSchema['_id'], ready: boolean };
    playedRounds: { playerId: string, card: Card }[][];
    currentTurn: UserSchema['_id'];
    nextTurn?: UserSchema['_id'];
    currentSuit?: string;
    currentWinningCard?: Card;
    overriddenBySpade: boolean;

    gameType: string;
    start: Date;
    end?: Date;
};

export interface PlayerData {
    playerId: UserSchema['_id'];
    playerName?: string;
    cards?: Card[];
    possibleMoves?: Card[];
};

export interface GameSchema extends Document {
    global: GlobalData;
    players: PlayerData[];
    status: string;
    createdBy: UserSchema['_id'];
};

const Game: Schema = new Schema({
    global: {
        type: {
            gameNumber: { type: Number, default: 0 },
            roundNumber: { type: Number, default: 0 },
            turnNumber: { type: Number, default: 0 },
            playerList: {
                type: [
                    {
                        playerId: { type: Schema.Types.ObjectId, ref: 'User' },
                        playerName: { type: String }
                    }
                ]
            },
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
            ready: {
                type: [
                    {
                        playerId: { type: Schema.Types.ObjectId, ref: 'User' },
                        ready: { type: Boolean, default: false }
                    }
                ]
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
            overriddenBySpade: { type: Boolean, default: false },

            gameType: { type: String },
            start: { type: Date },
            end: { type: Date, required: false }
        }
    },
    players: {
        type:
            [{
                playerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
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
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
});


export default model<GameSchema>('Game', Game);