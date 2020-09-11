import { GameSchema } from '../game/game.model';

export default (userId: string, game: GameSchema) => {
    const i = game.players.findIndex(p => String(p.id) === userId);
    const player = game.players[i];
    return { _id: game._id, global: game.global, player: player, status: game.status, createdBy: game.createdBy };
};