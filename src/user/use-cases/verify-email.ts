import User from '../user.model';

import CustomError from '../../lib/classes/CustomError';
import { RequestHandler } from 'express';

// localhost:xxxx/user/{userId}/verify/{verification_code}
const verifyEmail: RequestHandler = async (req, res, next) => {
    const userId = req.params.userId;
    const verificationCode = req.params.verificationCode;
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new CustomError('User does not exist', 500);
        }
        if (user.verification) {
            if (user.verification.token === verificationCode && user.verification.expires >= new Date()) {
                user.active = true;
                user.verification.expires = new Date();
            }
        }
        const savedUser = await user.save();
        res.status(201).json({ message: 'User has been successfully verified. Thanks.' });
    } catch (err) {
        next(err);
    }
};

export default verifyEmail;