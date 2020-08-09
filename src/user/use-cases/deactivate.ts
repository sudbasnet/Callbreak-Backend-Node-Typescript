import User from '../user.model';
import CustomError from '../../_helpers/custom-error';
import { RequestHandler } from 'express';

// GET: http://localhost:xxxxx/user/deactivate
const deactivate: RequestHandler = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            throw new CustomError('User does not exist', 500);
        }
        user.active = false;
        const savedUser = await user.save();
        res.status(201).json({ message: savedUser.name + ' has been deactivated, you can request reactivation at any time.' });
    } catch (err) {
        next(err);
    }
};

export default deactivate;