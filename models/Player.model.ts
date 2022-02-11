import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
    'name': String,
    'L5': Number
});

const PlayerModel = mongoose.model<mongoose.Document>('Player', playerSchema);

export default PlayerModel;