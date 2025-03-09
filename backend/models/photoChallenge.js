// models/photoChallenge.js
import mongoose from 'mongoose';

const photoChallengeSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    
    submissions: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        imageUrl: { type: String, required: true, trim: true },
        createdAt: { type: Date, default: Date.now }
    }],
    
    votes: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        submissionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Submission', required: true },
        createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

const PhotoChallenge = mongoose.model('PhotoChallenge', photoChallengeSchema);
export default PhotoChallenge;
