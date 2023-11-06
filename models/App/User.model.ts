import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    'mail': String,
    'password': String,
    'role': Number
});

const UserModel = mongoose.model<mongoose.Document>('User', userSchema);

export default UserModel;
module.exports = UserModel;