import { model, Schema, Document } from 'mongoose';
import { UserSchema } from '../user/user.model';
import { Hand } from '../_entities/Deck';

export interface Round {
    num: number;
    starterPlayer: UserSchema['_id'];
    playedTheirHands: UserSchema['_id'][];
    starterSuit: string;
    overriddenBySpade: boolean;
    cardsOnTheTable: string[];
    turn: number;
    nextPlayer: UserSchema['_id'];
    winningThisTurn: UserSchema['_id'];
};

export interface Player {
    userType: string;
    order: number;
    userId: UserSchema['_id'];
    pointsTotal?: number;
    pointsCurrentGame?: number;
    cards?: Hand;
    bet?: number;
};

export interface GameSchema extends Document {
    status: string;
    createdBy: UserSchema['_id'];
    gameType: string;
    players: Player[];
    start: Date;
    end?: Date;
    gameNumber: number; // 4 subgames in on main game
    round: Round;
};

const Game: Schema = new Schema({
    status: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    gameType: { type: String, required: true },
    players: {
        type: [{
            userType: { type: String, required: true },
            order: { type: Number, required: true },
            userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
            pointsTotal: { type: Number },
            pointsCurrentGame: { type: Number },
            cards: {
                type:
                {
                    spades: { type: [String] },
                    hearts: { type: [String] },
                    clubs: { type: [String] },
                    diamonds: { type: [String] },
                }
            },
            bet: { type: Number }
        }],
        validate: [(playersArray) => playersArray.length <= 4, 'Game is full.'],
        required: true
    },
    start: { type: Date, default: Date.now },
    end: { type: Date, default: Date.now },
    gameNumber: { type: Number }, // 4 subgames in on main game
    round: { // 13 rounds in each subgame
        type: {
            num: { type: Number },
            starterPlayer: { type: Schema.Types.ObjectId, ref: 'User', required: true }, //player that started the round
            playedTheirHands: { type: [{ type: Schema.Types.ObjectId, ref: 'User' }] },
            starterSuit: { type: String },
            overriddenBySpade: { type: Boolean }, // has spades taken over?
            cardsOnTheTable: { type: [String] }, // 4 or less cards
            turn: { type: Number }, // 4 turns in each round
            nextPlayer: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // the player who can make a move (player's ID)
            winningThisTurn: { type: Schema.Types.ObjectId, ref: 'User', required: true } // the player that's winning this round so far
        }
    }
});

export default model<GameSchema>('Game', Game);