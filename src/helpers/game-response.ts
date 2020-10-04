import { Schema } from "mongoose";
import IGameModel from "../entities/interfaces/IGameModel";

type mongooseIdType = string | Schema.Types.ObjectId;

export default (userId: string, game: IGameModel<mongooseIdType, mongooseIdType>) => {
    const i = game.privatePlayerList.findIndex(p => String(p.id) === userId);
    const player = game.privatePlayerList[i];
    const global = {
        handNumber: game.handNumber,
        roundNumber: game.roundNumber,
        playerList: game.playerList,
        scores: game.gameScores,
        playedHands: game.playedHands,
        cardsOnTable: game.cardsOnTable,
        currentTurn: game.currentTurn
    };

    return { _id: game._id, global: global, player: player, status: game.status, createdBy: game.createdBy };
};