import CustomError from '../../entities/classes/CustomError';
import { UserRepository } from '../../repositories/UserRepository';
import { RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';

const register: RequestHandler = async (req, res, next) => {
    const User = new UserRepository();
    const userId = req.userId;
    if (!userId) {
        throw new CustomError('The user does not exist.', 404);
    }
    try {
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            throw new CustomError('Validation has Failed', 422, validationErrors.array());
        }

        const user = await User.findById(userId);

        if (!user) {
            throw new CustomError('Invalid Request, user does not exist', 500);
        }
        const isCorrectCurrentPassword = await bcrypt.compare(req.body.currentPassword, user.password);
        if (!isCorrectCurrentPassword) {
            const salt = await bcrypt.genSalt(12);
            const newHashedPassword = await bcrypt.hash(req.body.newPassword, salt);
            user.password = newHashedPassword;
            await User.save(user);
        } else {
            throw new CustomError('Current password is incorrect', 500);
        }
        next();
    } catch (err) {
        next(err);
    }
};

export default register;