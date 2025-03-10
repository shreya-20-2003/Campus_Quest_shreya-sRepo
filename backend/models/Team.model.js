import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema(
  {
    teamName: {
      type: String,
      required: true,
      trim: true,
      unique: true // Uncomment if team names should be unique
    },
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    size: {
      type: Number,
      default: 1,
      min: [1, "A team must have at least one member."]
    },
    acceptedMembers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: []
    },
    pendingMembers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: []
    },
    registeredEvents: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Event",
      default: []
    },
    solved: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hunt"
      }
    ],
    Chat: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt fields
  }
);

const Team = mongoose.model("Team", teamSchema);
export default Team;
