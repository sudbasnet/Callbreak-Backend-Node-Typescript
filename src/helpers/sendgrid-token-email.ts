import nodemailer from 'nodemailer';
import nodemailerSendgrid from 'nodemailer-sendgrid';
import crypto from 'crypto';

import User from '../user/user.model';
import CustomError from '../lib/classes/CustomError';
import IEmailData from '../lib/interfaces/IEmailData';
import { EEmailTokenType } from '../lib/enums/enums';
import { IToken } from '../lib/interfaces/IUserModel';

const emailTransporter = nodemailer.createTransport(
    nodemailerSendgrid({
        apiKey: process.env.SENDGRID_API_KEY as string
    }));

const sendgridEmail = async (emailData: IEmailData) => {
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
                    const token: IToken = { token: buffer.toString('hex'), expires: new Date(Date.now() + 3600000) }

                    if (emailData.tokenType === EEmailTokenType.PASSWORD_RESET) {
                        user.passwordReset = token;
                        await user.save();
                    } else if (emailData.tokenType === EEmailTokenType.ACCOUNT_VERIFICATION) {
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