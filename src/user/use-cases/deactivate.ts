import { UserRepository } from '../../repositories/UserRepository';
import CustomError from '../../entities/classes/CustomError';
import { RequestHandler } from 'express';

// GET: http://localhost:xxxxx/user/deactivate
const deactivate: RequestHandler = async (req, res, next) => {
    const User = new UserRepository();

    const userId = req.userId;
    if (!userId) {
        throw new CustomError('The user does not exist.', 404);
    }
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new CustomError('User does not exist', 500);
        }
        user.active = false;
        const savedUser = await User.save(user);
        res.status(201).json({ message: savedUser.name + ' has been deactivated, you can request reactivation at any time.' });
    } catch (err) {
        next(err);
    }
};

export default deactivate;