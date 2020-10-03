import { body } from 'express-validator';

import User from '../user/user.model';

import CustomError from '../entities/classes/CustomError';

export default
    [
        body('name').trim().not().isEmpty(),

        body('email')
            .isEmail()
            .withMessage('Please enter a valid email address.')
            .custom((value, { req }) => {
                return User.findOne({ email: value, active: true })
                    .then(user => {
                        if (user) {
                            return Promise.reject('E-mail is already registered');
                        }
                    });
            })
            .custom((value, { req }) => {
                return User.findOne({ email: value, active: false })
                    .then(user => {
                        if (user) {
                            return Promise.reject('E-mail is already registered. Please verify.');
                        }
                    });
            })
            .normalizeEmail(),

        body('password')
            .isLength({ min: 8, max: 1024 }),

        body('confirmPassword')
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new CustomError('Both passwords should match', 401, null);
                } else {
                    return true;
                }
            })
    ];