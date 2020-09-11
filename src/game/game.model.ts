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
    playerList: {
        id: UserSchema['_id'],
        name: string,
        bet: number,
        score: number,
        totalScore: number
        betPlaced: boolean
    }[];
    scores: {
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
};

export interface PlayerData {
    id: UserSchema['_id'];
    name?: string;
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
                        id: { type: Schema.Types.ObjectId, ref: 'User' },
                        name: { type: String },
                        bet: { type: Number },
                        score: { type: Number },
                        totalScore: { type: Number },
                        betPlaced: { type: Boolean, default: false },
                    }
                ]
            },
            scores: {
                type: [{
                    playerId: { type: Schema.Types.ObjectId, ref: 'User' },
                    gameNumber: { type: Number },
                    score: { type: Number }
                }]
            },
            playedRounds: {
                type:
                    [
                        [{
                            won: { type: Boolean },
                            card: {
                                type:
                                {
                                    suit: String,
                                    value: String
                                }
                            }
                        }]
                    ]
            },
            cardsOnTable: { type: [{ type: Card }] },
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
                id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
                name: { type: String, required: false },
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