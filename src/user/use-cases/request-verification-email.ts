import accountVerificationEmail from '../../_helpers/account-verification-email';
import { RequestHandler } from 'express';

// GET: localhost:xxxx/user/{userId}/request-verification-email
const requestVerificationEmail: RequestHandler = async (req, res, next) => {
    const userId = req.params.userId;
    try {
        const sendEmail = await accountVerificationEmail(userId);
        res.status(201).json({ message: 'You should receive a verification email. Please click on link provided in the email.' })
    } catch (err) {
        next(err);
    }
};

export default requestVerificationEmail;