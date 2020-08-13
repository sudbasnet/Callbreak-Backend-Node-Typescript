import { Router } from 'express';
import gameController from './game.controller';

const router = Router();

// CALLBREAK specific routes
// router.get('/callbreak/:gameId/start', gameController.callbreakStart); // success method 200

// Other Routes
router.get('/:gameType/new', gameController.create); // returns a gameId

router.get('/:gameType/:gameId/join', gameController.join); // success method 200

router.delete('/:gameType/new/', gameController.cancel); // returns a gameId
export default router;