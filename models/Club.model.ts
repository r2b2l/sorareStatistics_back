import mongoose from "mongoose";

const clubSchema = new mongoose.Schema({
    'name': String,
    'players': Array
});

const ClubModel = mongoose.model<mongoose.Document>('Club', clubSchema);

export default ClubModel;