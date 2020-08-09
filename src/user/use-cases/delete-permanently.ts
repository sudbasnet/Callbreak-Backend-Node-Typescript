import User from '../user.model';

import CustomError from '../../_helpers/custom-error';
import { RequestHandler } from 'express';

// GET: http://localhost:xxxxx/user/delete_account
const deletePermanently: RequestHandler = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
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