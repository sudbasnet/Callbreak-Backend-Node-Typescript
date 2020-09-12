import { GameSchema } from '../game/game.model';

export default (userId: string, game: GameSchema) => {
    const i = game.players.findIndex(p => String(p.id) === userId);
    const player = game.players[i];
    const global = {
        gameNumber: game.gameNumber,
        roundNumber: game.roundNumber,
        playerList: game.playerList,
        scores: game.gameScores,
        playedRounds: game.playedRounds,
        cardsOnTable: game.cardsOnTable,
        currentTurn: game.currentTurn
    };

    return { _id: game._id, global: global, player: player, status: game.status, createdBy: game.createdBy };
};