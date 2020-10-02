import User from '../user.model';
import CustomError from '../../entities/classes/CustomError';

import { RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';

const register: RequestHandler = async (req, res, next) => {
    try {
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            throw new CustomError('Validation has Failed', 422, validationErrors.array());
        }
        const userId = req.userId;
        const user = await User.findById(userId);

        if (!user) {
            throw new CustomError('Invalid Request, user does not exist', 500);
        }
        const isCorrectCurrentPassword = await bcrypt.compare(req.body.currentPassword, user.password);
        if (!isCorrectCurrentPassword) {
            const salt = await bcrypt.genSalt(12);
            const newHashedPassword = await bcrypt.hash(req.body.newPassword, salt);
            user.password = newHashedPassword;
            await user.save();
        } else {
            throw new CustomError('Current password is incorrect', 500);
        }
        next();
    } catch (err) {
        next(err);
    }
};

export default register;