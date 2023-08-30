import mongoose, { Schema } from "mongoose";
import { authenticationService } from "../../common";

const userSchema: Schema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.pre('save', async function(done) {
    if (this.isModified('password')  || this.isNew) {
        const hasedPwd = await authenticationService.pwdToHash(this.get('password'));
        this.set('password', hasedPwd);
    }

    done()
});

export const User = mongoose.model('User', userSchema, 'users_collection');


