import { Router } from 'express';

import userController from './user.controller';
import authenticationVerification from '../_middlewares/authentication-verification';
import registrationDataValidation from '../_middlewares/registration-data-validation';

const router = Router();

router.put('/register', registrationDataValidation, userController.userRegistration);

router.post('/login', userController.userLogin);

router.get('/:userId/verify/:verificationCode', userController.verifyEmail);

router.post('/:userId/password-reset/:resetCode', userController.resetPassword);

// routes that require authentication
router.get('/deactivate', authenticationVerification, userController.deactivate);

router.get('/delete_account', authenticationVerification, userController.deletePermanently);

export default router;