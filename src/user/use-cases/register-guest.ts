import { UserRepository } from '../../repositories/UserRepository';
import CustomError from '../../entities/classes/CustomError';
import { RequestHandler } from 'express';
import { EUserRoles } from '../../entities/enums/enums';
import jwt from 'jsonwebtoken';

const register: RequestHandler = async (req, res, next) => {
    const User = new UserRepository();
    const name = req.body.name;
    if (!name) {
        throw new CustomError('Guest needs to have a name!', 500);
    }
    try {
        const guestUser = await User.create({
            name: req.body.name,
            email: 'guest@callbreak.com',
            password: 'xxxxxxxxx',
            role: EUserRoles.GUEST,
            active: true
        });

        const savedUser = await User.save(guestUser);
        const jwtToken = jwt.sign({ userId: savedUser._id, userName: savedUser.name }, process.env.TOKEN_SECRET as string);

        res.status(200).json({ _id: savedUser._id, name: savedUser.name, email: 'xxx', userType: EUserRoles.GUEST, token: jwtToken });
    }
    catch (err) {
        next(err);
    }
};

export default register;