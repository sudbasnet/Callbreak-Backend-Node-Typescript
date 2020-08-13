import { RequestHandler } from "express";
import EmailData from '../../_entities/EmailData';
import sendgridEmail from '../../_helpers/sendgrid-token-email';

// should be a get request ??
const requestPasswordReset: RequestHandler = async (req, res, next) => {
    const userId = req.params.userId;
    const userData: EmailData = {
        sender: 'restapi201@gmail.com',
        recipientId: userId,
        subject: 'Cardgames - Password Reset',
        htmlBody: '<h1>To reset your password, please click on link below</h1>',
        link: `http://localhost:` + process.env.PORT + `/user/` + userId + `/password_reset/`
    };
    try {
        await sendgridEmail(userData);
        res.status(201).json({ message: 'You should receive a verification email. Please click on link provided in the email.' })
    } catch (err) {
        next(err);
    }
};

export default requestPasswordReset;
