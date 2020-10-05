import { RequestHandler } from 'express';
import { UserRepository } from '../../repositories/UserRepository';
import CustomError from '../../entities/classes/CustomError';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as dotenv from "dotenv";
import { EUserRoles } from '../../entities/enums/enums';

dotenv.config();

const login: RequestHandler = async (req, res, next) => {
    const User = new UserRepository();
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            throw new CustomError('Email is incorrect.', 401);
        }
        const isCorrectPassword = await bcrypt.compare(req.body.password, user.password);
        if (!isCorrectPassword) {
            throw new CustomError('Password is incorrect.', 401);
        }
        const jwtToken = jwt.sign({ userId: user._id, userName: user.name }, process.env.TOKEN_SECRET as string);
        res.status(200).json({ _id: user._id, name: user.name, email: user.email, userType: EUserRoles.PLAYER, token: jwtToken });
    }
    catch (err) {
        next(err);
    }
};

export default login;