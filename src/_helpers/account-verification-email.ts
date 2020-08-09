import User from '../user/user.model';

import nodemailer from 'nodemailer';

import nodemailerSendgrid from 'nodemailer-sendgrid';

import crypto from 'crypto';

const emailTransporter = nodemailer.createTransport(
    nodemailerSendgrid({
        apiKey: process.env.SENDGRID_API_KEY as string
    }));

export default async (userId: string) => {
    try {
        crypto.randomBytes(32, async (err, buffer) => {
            try {
                if (err) {
                    throw err;
                }
                const token = buffer.toString('hex');
                const user = await User.findById(userId);
                if (user) {
                    if (user.active === true) {
                        throw Error('User is already verified.');
                    }
                    user.verification = { token: token, expires: new Date(Date.now() + 3600000) };
                    const savedUser = await user.save();

                    if (savedUser.verification) {
                        await emailTransporter.sendMail({
                            to: savedUser.email,
                            from: 'restapi201@gmail.com',
                            subject: 'Cardgames Registration',
                            html: `<h1>To complete registration, please click on link below</h1>
                        <br>
                        <a href="http://localhost:`+ process.env.PORT + `/user/` + savedUser._id + `/verify/` + savedUser.verification.token + `">VERIFY ACCOUNT</a>`
                        });
                    }
                }
            } catch (err) {
                throw err;
            }
        });
    } catch (err) {
        throw err;
    }
};