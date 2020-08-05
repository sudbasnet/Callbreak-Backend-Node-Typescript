import { RequestHandler } from 'express';

import User from '../user.model';

import CustomError from '../../_helpers/custom-error';

import bcrypt from 'bcryptjs';

import { validationResult } from 'express-validator';

const accountVerificationEmail = require('../../_helpers/account-verification-email');

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

        res.status(201).json({ message: 'User created, verify email', userId: savedUser._id });

        // const verifyAccount = await accountVerificationEmail(savedUser._id);
        // removing the email verification for testing, need to be active for actual application

    }
    catch (err) {
        next(err);
    }
};

export default register;