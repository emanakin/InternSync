import mongoose, { Schema, Document } from "mongoose";

interface ScoreEntry {
    jobId: string;
    resumeRef: string;
    score: number;
}

interface UserScoresDocument extends Document {
    userId: string;
    scores: ScoreEntry[];
}

const ScoreSchema: Schema = new Schema({
    jobId: { type: String, required: true },
    resumeRef: { type: String, required: true },
    score: { type: Number, required: true }
}, { _id: false });

const UserScoresSchema: Schema = new Schema({
    userId: { type: String, required: true, unique: true },
    scores: [ScoreSchema]
});

export const UserScores = mongoose.model<UserScoresDocument>('UserScore', UserScoresSchema, 'user_scores_collection');

