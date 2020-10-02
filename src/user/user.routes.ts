import { Router } from 'express';

import userController from './user.controller';
import authenticationVerification from '../middlewares/authentication-verification';
import registrationDataValidation from '../middlewares/registration-data-validation';
import updatedPasswordValidation from '../middlewares/updated-password-validation';

const router = Router();

router.put('/register', registrationDataValidation, userController.userRegistration, userController.requestVerificationEmail);

router.post('/login', userController.userLogin);

router.get('/:userId/request-verification-email', userController.requestVerificationEmail);

router.get('/:userId/verify/:verificationCode', userController.verifyEmail);

router.get('/request-password-reset/:email', userController.requestPasswordReset);

router.post('/:userId/password-reset/:resetCode', userController.resetPassword);

router.get('/:userId/password-reset/:resetCode', (req, res, next) => { }); /// requires frontend to configure

// routes that require authentication
router.get('/deactivate', authenticationVerification, userController.deactivate);

router.get('/delete-account', authenticationVerification, userController.deletePermanently);

router.put('/update-password', updatedPasswordValidation, userController.updatePassword);

export default router;