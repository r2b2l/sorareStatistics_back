import mongoose from "mongoose";
import ClubModel from "./Club.model";

const playerSchema = new mongoose.Schema({
    'name': String,
    'club':  {
        ref: 'Club',
        type: mongoose.Schema.Types.ObjectId,
      },
    'L5': Number
});

const PlayerModel = mongoose.model<mongoose.Document>('Player', playerSchema);

export default PlayerModel;