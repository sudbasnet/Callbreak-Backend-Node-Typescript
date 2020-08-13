import { RequestHandler } from "express";
import EmailData, { TokenType } from '../../_entities/EmailData';
import sendgridEmail from '../../_helpers/sendgrid-token-email';
import User from '../user.model';
import CustomError from '../../_helpers/custom-error';

// should be a get request ??
const requestPasswordReset: RequestHandler = async (req, res, next) => {
    const userEmail = req.params.email;
    const user = await User.findOne({ email: userEmail });

    if (!user) {
        throw new CustomError('User with that email does not exist', 404);
    }

    const userData: EmailData = {
        sender: 'restapi201@gmail.com',
        tokenType: TokenType.PASSWORD_RESET,
        recipientId: user._id,
        subject: 'Cardgames - Password Reset',
        htmlBody: '<h1>To reset your password, please click on link below</h1>',
        link: `http://localhost:` + process.env.PORT + `/user/` + user._id + `/password_reset/`,
        linkText: 'Reset Password'
    };
    try {
        await sendgridEmail(userData);
        res.status(201).json({ message: 'You should receive an email to reset your password. </br> Please click on link provided.' })
    } catch (err) {
        next(err);
    }
};

export default requestPasswordReset;
