import create from './use-cases/create';
import join from './use-cases/join';
import cancel from './use-cases/cancel';
import gameData from './use-cases/game-data';
import start from './use-cases/start'
import bet from './use-cases/bet';
import botBet from './use-cases/bot/request-bet';
import botMove from './use-cases/bot/request-move'
import processMove from './use-cases/process-move'
import returnMoveResult from './use-cases/return-move-result'

export default {
    create,
    join,
    cancel,
    start,
    gameData,
    bet,
    botBet,
    botMove,
    processMove,
    returnMoveResult
}