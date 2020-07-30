import { Model, Schema, Document } from 'mongoose';

const userSchema = new Schema({
    name: { type: String, required: true, min: 3, max: 225 },
    email: { type: String, required: true, min: 6, max: 225 },
    password: { type: String, required: true, max: 1024, min: 6 },
    active: { type: Boolean, default: false },
    verification: {
        type: { token: { type: String }, expires: { type: Date } }
    },
    passwordReset: {
        type: { token: { type: String }, expires: { type: Date } }
    }
},
    { timestamps: true }
);

// module.exports = mongoose.model('User', userSchema);

export interface User {

}