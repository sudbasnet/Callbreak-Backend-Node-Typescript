import { IGameSchema } from '../game/game.model';

export default (userId: string, game: IGameSchema) => {
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