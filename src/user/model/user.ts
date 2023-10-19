import { model, Schema, Document } from "mongoose";
import * as bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

export interface I_User extends Document {
    name?: string;
    email: string,
    password: string,
    role: 'ADMIN' | 'STAFF' | 'STUDENT',
    tokens?: token[];
}

type token = {
    token: Object;
}
export const UserSchema: Schema = new Schema({
    name: String,
    email: {
        type: String,
        unique: true,
        require: true,
        lowercase: true,
    },
    password: {
        type: String,
        require: true,
    },
    role: {
        type: String,
        require: true,
        uppercase: true
    },
    tokens: [{
        token: {
            type: String
        }
    }],
}, {
    timestamps: true
})

//adding password hasing
UserSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});


// Generate a JWT token for the user
UserSchema.methods.generateAuthToken = async function (): Promise<string> {
    const user = this as I_User; // Cast to User type
    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret'); // Replace 'your-secret-key' with your actual secret key

    user.tokens = user.tokens || [];

    return token;
};

//we don't share the password and token
UserSchema.methods.toJSON = function () {
    const user = this;
    const UserObject = user.toObject();

    delete UserObject.password;
    delete UserObject.tokens;

    return UserObject;
}

export const UserModel = model<I_User>('User', UserSchema, 'user');