require('dotenv').config();

import User from '../user/user.model';

import nodemailer from 'nodemailer';

import nodemailerSendgrid from 'nodemailer-sendgrid';

import crypto from 'crypto';

const emailTransporter = nodemailer.createTransport(
    nodemailerSendgrid({
        apiKey: process.env.SENDGRID_API_KEY as string
    }));

export default async (userEmail: string) => {
    try {
        crypto.randomBytes(32, async (err, buffer) => {
            try {
                if (err) {
                    throw err;
                }
                const token = buffer.toString('hex');
                const user = await User.findOne({ email: userEmail });
                if (!user) {
                    throw Error('User does not exist');
                }

                user.passwordReset = { token: token, expires: new Date(Date.now() + 3600000) };
                const savedUser = await user.save();

                if (savedUser.passwordReset) {
                    await emailTransporter.sendMail({
                        to: savedUser.email,
                        from: 'restapi201@gmail.com',
                        subject: 'Cardgames - Password Reset',
                        html: `<h1>To reset your password, please click on link below</h1>
                        <br>
                        http://localhost:`+ process.env.PORT + `/user/` + savedUser._id + `/password_reset/` + savedUser.passwordReset.token
                    });
                }
            } catch (err) {
                throw err;
            }
        });
    } catch (err) {
        throw err;
    }
}