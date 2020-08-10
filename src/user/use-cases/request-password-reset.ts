import { RequestHandler } from "express";
import passwordResetEmail from '../../_helpers/password-reset-email';
// import CustomError from '../../_helpers/custom-error';

const requestPasswordReset: RequestHandler = async (req, res, next) => {
    const userEmail = req.body.email;
    try {
        const sendEmail = await passwordResetEmail(userEmail);
        res.status(201).json({ message: 'You should receive a verification email. Please click on link provided in the email.' })
    } catch (err) {
        next(err);
    }
};

export default requestPasswordReset;
