import { Router } from 'express';

import userController from './user.controller';
import verifyAuthentication from '../services/verify-authentication';
import validateRegistrationData from '../services/validate-registration-data';

const router = Router();

router.put('/register', validateRegistrationData, userController.userRegistration, userController.requestVerificationEmail);

router.post('/login', userController.userLogin);

router.get('/:userId/request-verification-email', userController.requestVerificationEmail);

router.get('/:userId/verify/:verificationCode', userController.verifyEmail);

router.get('/request-password-reset/:email', userController.requestPasswordReset);

router.post('/:userId/password-reset/:resetCode', userController.resetPassword);

router.get('/:userId/password-reset/:resetCode', (req, res, next) => { }); /// requires frontend to configure

// routes that require authentication
router.get('/deactivate', verifyAuthentication, userController.deactivate);

router.get('/delete-account', verifyAuthentication, userController.deletePermanently);

router.put('/update-password', verifyAuthentication, userController.updatePassword);

export default router;