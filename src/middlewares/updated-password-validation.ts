import { body } from 'express-validator';
import CustomError from '../lib/classes/CustomError';

export default
    [
        body('currentPassword')
            .isLength({ min: 8, max: 1024 }),
        body('newPassword')
            .isLength({ min: 8, max: 1024 })
            .custom((value, { req }) => {
                if (value !== req.body.currentPassword) {
                    throw new CustomError('New password cannot be same as the existing password', 401);
                } else {
                    return true;
                }
            }),
        body('confirmPassword')
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new CustomError('Both new passwords should match', 401);
                } else {
                    return true;
                }
            })
    ];