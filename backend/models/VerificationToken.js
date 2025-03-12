import mongoose from "mongoose";

const VerificationTokenSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    token: {
      type: String,
      required: true,
      unique: true, // Ensure unique tokens
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 600, // Expires in 10 minutes (600 seconds)
    },
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);

// Index for quick lookup
VerificationTokenSchema.index({ email: 1, token: 1 });

const VerificationToken = mongoose.model(
  "VerificationToken",
  VerificationTokenSchema
);

export default VerificationToken;
