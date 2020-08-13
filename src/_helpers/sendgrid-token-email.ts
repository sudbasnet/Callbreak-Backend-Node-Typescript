import nodemailer from 'nodemailer';
import nodemailerSendgrid from 'nodemailer-sendgrid';
import crypto from 'crypto';

import User, { Token } from '../user/user.model';
import CustomError from './custom-error';
import EmailData, { TokenType } from '../_entities/EmailData';

const emailTransporter = nodemailer.createTransport(
    nodemailerSendgrid({
        apiKey: process.env.SENDGRID_API_KEY as string
    }));

const sendgridEmail = async (emailData: EmailData) => {
    try {
        crypto.randomBytes(32,
            async (err, buffer) => {
                try {
                    if (err) {
                        throw err;
                    }
                    const user = await User.findById(emailData.recipientId);
                    if (!user) {
                        throw new CustomError('User does not exist', 404);
                    }
                    const token: Token = { token: buffer.toString('hex'), expires: new Date(Date.now() + 3600000) }

                    if (emailData.tokenType === TokenType.PASSWORD_RESET) {
                        user.passwordReset = token;
                        await user.save();
                    } else if (emailData.tokenType === TokenType.ACCOUNT_VERIFICATION) {
                        user.verification = token;
                        await user.save();
                    }

                    await emailTransporter.sendMail(
                        {
                            to: user.email,
                            from: emailData.sender,
                            subject: emailData.subject,
                            html: emailData.htmlBody + `<br>` +
                                (
                                    (emailData.link && emailData.tokenType && emailData.linkText) ?
                                        `<a href="` + emailData.link + token.token + `">` + emailData.linkText + `</a>`
                                        : ``
                                )
                        }
                    );
                } catch (err) {
                    throw err;
                }
            }
        );
    } catch (err) {
        throw err;
    }
};

export default sendgridEmail;  