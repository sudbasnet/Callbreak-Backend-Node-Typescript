import { RequestHandler } from 'express';
import sendgridEmail from '../../_helpers/sendgrid-token-email';
import EmailData from '../../_entities/EmailData';

// GET: localhost:xxxx/user/{userId}/request-verification-email
const requestVerificationEmail: RequestHandler = async (req, res, next) => {
    const userId = req.params.userId;
    const userData: EmailData = {
        sender: 'restapi201@gmail.com',
        recipientId: userId,
        subject: 'Cardgames Registration',
        htmlBody: '<h1>To complete registration, please click on link below</h1>',
        link: `http://localhost:` + process.env.PORT + `/user/` + userId + `/verify/`
    };
    try {
        await sendgridEmail(userData);
        res.status(201).json({ message: 'You should receive a verification email. Please click on link provided in the email.' })
    } catch (err) {
        next(err);
    }
};

export default requestVerificationEmail;