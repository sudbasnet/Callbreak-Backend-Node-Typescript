import create from './use-cases/create';
import join from './use-cases/join';
import cancel from './use-cases/cancel';
import gameData from './use-cases/game-data';
import start from './use-cases/start'
import bet from './use-cases/bet';
import botBet from './use-cases/bot/request-bet';

export default {
    create,
    join,
    cancel,
    start,
    gameData,
    bet,
    botBet
}