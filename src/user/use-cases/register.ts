import User from '../user.model';
import CustomError from '../../_helpers/custom-error';

import { RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';

const register: RequestHandler = async (req, res, next) => {
    try {
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            throw new CustomError('Validation has Failed', 422, validationErrors.array());
        }

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({
            name: req.body.name, email: req.body.email, password: hashedPassword,
            active: true // remove this in production
        });
        const savedUser = await newUser.save();
        req.params.userId = savedUser._id;
        next();
    }
    catch (err) {
        next(err);
    }
};

export default register;