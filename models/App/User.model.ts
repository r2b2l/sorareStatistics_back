import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    mail: { type: String, unique: true },
    password: String,
    role: Number
});

interface UserType {
    mail?: string,
    password?: string,
    role?: number
}

const UserModel = mongoose.model<UserType>('User', userSchema);

export default UserModel;
module.exports = UserModel;