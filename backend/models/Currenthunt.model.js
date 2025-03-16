import mongoose from 'mongoose';

// Define the schema for an ongoing hunt
const currentHuntSchema = new mongoose.Schema(
    {
        // Reference to the user participating in the hunt
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true, // Ensures a hunt must be linked to a user
        },

        // Reference to the hunt that the user is engaged in
        hunt: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hunt",
            required: true, // Ensures a valid hunt is associated
        },

        // Start time of the hunt (defaults to the time of creation)
        startTime: {
            type: Date,
            default: Date.now,
            required: true,
        },

        // End time of the hunt (optional, will be set when the hunt ends)
        endTime: {
            type: Date,
        },

        // Status of the hunt (e.g., "active", "completed", "abandoned")
        status: {
            type: String,
            enum: ["active", "completed", "abandoned"],
            default: "active",
        },
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt timestamps
);

// Create the Mongoose model for CurrentHunt
const CurrentHunt = mongoose.model("CurrentHunt", currentHuntSchema);

export default CurrentHunt;


