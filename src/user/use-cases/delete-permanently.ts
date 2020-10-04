import { UserRepository } from '../../repositories/UserRepository';
import CustomError from '../../entities/classes/CustomError';
import { RequestHandler } from 'express';

// GET: http://localhost:xxxxx/user/delete_account
const deletePermanently: RequestHandler = async (req, res, next) => {
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
        const name = user.name;
        const result = await User.deleteOne({ _id: req.userId });
        res.status(201).json({ message: name + ' has been deleted, you can register again at a later time if you want to.' });
    } catch (err) {
        next(err);
    }
};

export default deletePermanently;