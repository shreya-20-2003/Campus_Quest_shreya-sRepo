// models/photoChallenge.js
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// Submissions Schema
const submissionSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    imageUrl: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now }
});

// Votes Schema
const voteSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    submissionId: { type: Schema.Types.ObjectId, ref: 'Submission', required: true },
    createdAt: { type: Date, default: Date.now }
});

// Main PhotoChallenge Schema
const photoChallengeSchema = new Schema({
    title: { type: String, required: true, trim: true, minlength: 3 },
    description: { type: String, required: true, trim: true, minlength: 10 },
    startDate: { type: Date, required: true, index: true },
    endDate: { 
        type: Date, 
        required: true, 
        validate: {
            validator: function (value) { return value > this.startDate; },
            message: "End date must be after the start date."
        }
    },
    submissions: [submissionSchema],
    votes: [voteSchema]
}, { timestamps: true });

// Virtual for active status
photoChallengeSchema.virtual('isActive').get(function () {
    const now = new Date();
    return this.startDate <= now && this.endDate >= now;
});

// Static method to get active challenges
photoChallengeSchema.statics.getActiveChallenges = function () {
    return this.find({ startDate: { $lte: new Date() }, endDate: { $gte: new Date() } });
};

const PhotoChallenge = model('PhotoChallenge', photoChallengeSchema);
export default PhotoChallenge;

