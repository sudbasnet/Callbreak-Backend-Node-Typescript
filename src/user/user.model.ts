import { model, Schema, Document } from 'mongoose';

export interface Token {
    token: string;
    expires: Date;
};

export interface UserSchema extends Document {
    name: string;
    email: string;
    password: string;
    active: boolean;
    role?: string;
    verification?: Token;
    passwordReset?: Token;
};

export enum UserRole { ADMIN = 'admin', PLAYER = 'player' };

const User: Schema<UserSchema> = new Schema({
    name: { type: String, required: true, min: 3, max: 225 },
    email: { type: String, required: true, min: 6, max: 225 },
    password: { type: String, required: true, max: 1024, min: 6 },
    active: { type: Boolean, default: false },
    role: { type: String, default: UserRole.PLAYER },
    verification: {
        type: { token: { type: String }, expires: { type: Date } }
    },
    passwordReset: {
        type: { token: { type: String }, expires: { type: Date } }
    }
},
    { timestamps: true }
);

User.statics = {
    async findAllBots() {
        return await this.find({ role: 'bot' });
    }
};

export default model<UserSchema>('User', User);
