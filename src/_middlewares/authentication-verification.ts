import { RequestHandler } from "express";

import jwt from 'jsonwebtoken';

import CustomError from '../_helpers/custom-error';
import resetPassword from "../user/use-cases/reset-password";

const verifyAuthentication: RequestHandler = (req, res, next) => {
    const authorizationHeader = req.get('Authorization');
    if (!authorizationHeader) {
        throw new CustomError('Unauthorized Access', 401, null);
    }
    const token = authorizationHeader.split(' ')[1];

    try {
        const verifiedToken: any = jwt.verify(token, process.env.TOKEN_SECRET as string);
        if (typeof verifiedToken === 'object' && 'userId' in verifiedToken && 'userName' in verifiedToken) {
            req.userId = verifiedToken.userId;
            req.userName = verifiedToken.userName;
        }
        next();
    } catch (err) {
        if (!err.status) {
            err.status = 401;
            throw err;
        }
    }
};

export default verifyAuthentication;