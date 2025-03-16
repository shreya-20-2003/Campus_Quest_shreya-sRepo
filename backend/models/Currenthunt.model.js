import mongoose from 'mongoose';

// Define the schema for an ongoing hunt
const currentHuntSchema = new mongoose.Schema(
    {
        // Reference to the user participating in the hunt
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true, // Index for faster lookup
        },

        // Reference to the hunt that the user is engaged in
        hunt: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hunt",
            required: true,
            index: true, // Index for faster lookup
        },

        // Start time of the hunt (defaults to the time of creation)
        startTime: {
            type: Date,
            default: Date.now,
            required: true,
        },

        // End time of the hunt (set only when completed)
        endTime: {
            type: Date,
            default: null, // Ensures null until the hunt is finished
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

// Virtual field to calculate hunt duration dynamically
currentHuntSchema.virtual("duration").get(function () {
    return this.endTime ? Math.abs(this.endTime - this.startTime) : null;
});

// Middleware to ensure endTime is set only when hunt is completed
currentHuntSchema.pre("save", function (next) {
    if (this.status === "completed" && !this.endTime) {
        this.endTime = new Date();
    }
    next();
});

// Create the Mongoose model for CurrentHunt
const CurrentHunt = mongoose.model("CurrentHunt", currentHuntSchema);

export default CurrentHunt;


