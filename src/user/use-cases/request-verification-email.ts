import { RequestHandler } from 'express';
import { EEmailTokenType } from '../../entities/enums/enums';
import IEmailData from '../../entities/interfaces/IEmailData';
import sendgridEmail from '../../helpers/sendgrid-token-email';

// GET: localhost:xxxx/user/{userId}/request-verification-email
const requestVerificationEmail: RequestHandler = async (req, res, next) => {
    const userId = req.params.userId;

    const userData: IEmailData = {
        sender: 'restapi201@gmail.com',
        tokenType: EEmailTokenType.ACCOUNT_VERIFICATION,
        recipientId: userId,
        subject: 'Cardgames Registration',
        htmlBody: '<h1>To complete registration, please click on link below</h1>',
        link: `http://localhost:` + process.env.PORT + `/user/` + userId + `/verify/`,
        linkText: 'Verify Account'
    };
    try {
        await sendgridEmail(userData);
        res.status(201).json({ message: 'You should receive a verification email. Please click on link provided.' })
    } catch (err) {
        next(err);
    }
};

export default requestVerificationEmail;