import { Router } from 'express';

import userController from './user.controller';

import registrationDataValidation from '../_middlewares/registration-data-validation';

const router = Router();

router.put('/register', registrationDataValidation, userController.userRegistration);

router.post('/login', userController.userLogin);

export default router;