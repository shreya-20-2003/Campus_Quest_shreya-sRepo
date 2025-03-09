// models/business.js
import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    contact: { type: String, trim: true },
    category: { type: String, trim: true },
    description: { type: String, trim: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    reviews: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        rating: { 
            type: Number, 
            required: true, 
            min: 1, 
            max: 5 
        },
        comment: { type: String, trim: true },
        createdAt: { type: Date, default: Date.now },
    }],
    
    offers: [{
        title: { type: String, required: true, trim: true },
        description: { type: String, trim: true },
        validUntil: { type: Date, required: true },
    }],
}, { timestamps: true });

const Business = mongoose.model('Business', businessSchema);
export default Business;