import nodemailer from 'nodemailer';
import nodemailerSendgrid from 'nodemailer-sendgrid';
import crypto from 'crypto';
import { UserRepository } from '../repositories/UserRepository';
import CustomError from '../entities/classes/CustomError';
import IEmailData from '../entities/interfaces/IEmailData';
import { EEmailTokenType } from '../entities/enums/enums';
import { IToken } from '../entities/interfaces/IUserModel';

const emailTransporter = nodemailer.createTransport(
    nodemailerSendgrid({
        apiKey: process.env.SENDGRID_API_KEY as string
    }));

const sendgridEmail = async (emailData: IEmailData) => {
    const User = new UserRepository();
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
                        await User.save(user);
                    } else if (emailData.tokenType === EEmailTokenType.ACCOUNT_VERIFICATION) {
                        user.verification = token;
                        await User.save(user);
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