import { model, Schema, Document } from 'mongoose';
import { IUserSchema } from '../user/user.model';

type Hand = {
    spades: string[];
    hearts: string[];
    clubs: string[];
    diamonds: string[];
};

type Round = {
    num: number;
    starterPlayer: IUserSchema['_id'];
    playedTheirHands: IUserSchema['_id'][];
    starterSuit: string;
    overriddenBySpade: boolean;
    cardsOnTheTable: string[];
    turn: number;
    nextPlayer: IUserSchema['_id'];
    winningThisTurn: IUserSchema['_id'];
};

type Player = {
    userType: string;
    order: number;
    userId: IUserSchema['_id'];
    pointsTotal: number;
    pointsCurrentGame: number;
    cards: Hand;
    bet: number;
};

export interface IGameSchema extends Document {
    status: string;
    createdBy: IUserSchema['_id'];
    gameType: string;
    players: Player[];
    start: Date;
    end?: Date;
    gameNumber: number; // 4 subgames in on main game
    round: Round;
};

const GameSchema: Schema = new Schema({
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

export default model<IGameSchema>('Game', GameSchema);