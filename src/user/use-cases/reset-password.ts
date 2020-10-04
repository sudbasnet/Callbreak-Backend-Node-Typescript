import { RequestHandler } from "express";
import { UserRepository } from '../../repositories/UserRepository';
import bcrypt from 'bcryptjs';
import CustomError from '../../entities/classes/CustomError';

// POST localhost:xxxx/user/{userId}/reset/{reset_code}
const resetPassword: RequestHandler = async (req, res, next) => {
    const User = new UserRepository();
    const userId = req.params.userId;
    const passwordResetToken = req.params.resetCode;
    const newPassword = req.body.password;

    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new CustomError('User does not exist', 404);
        }
        if (user.passwordReset) {
            if (user.passwordReset.token === passwordResetToken && user.passwordReset.expires >= new Date()) {
                const salt = await bcrypt.genSalt(12);
                const hashedPassword = await bcrypt.hash(newPassword, salt);
                user.password = hashedPassword;
                const savedUser = await User.save(user);

                res.status(201).json({ message: 'Password successfully updated. Please log in.' })
            } else {
                throw new CustomError('Validation Failed', 401);
            }
        }
    } catch (err) {
        next(err);
    }
};

export default resetPassword;