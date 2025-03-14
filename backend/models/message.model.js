import { model, Schema } from "mongoose";

const messageSchema = new Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    message: {
      type: String,
      trim: true,
      required: [true, "Message content cannot be empty"]
    },
    messageType: {
      type: String,
      enum: ["text", "image", "video", "file"],
      default: "text"
    },
    attachments: [
      {
        url: String, // File URL
        fileType: String // "image", "video", "pdf", etc.
      }
    ],
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent"
    },
    read: {
      type: Boolean,
      default: false
    },
    readAt: {
      type: Date // Timestamp when the message was read
    },
    replyTo: {
      type: Schema.Types.ObjectId,
      ref: "Message", // Reference to another message (for replies)
      default: null
    },
    deletedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User" // Tracks who deleted the message
      }
    ],
    isDeleted: {
      type: Boolean,
      default: false
    },
    reactions: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User"
        },
        emoji: String // Stores reaction emoji (e.g., "❤️", "😂")
      }
    ]
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt timestamps
  }
);

// Middleware: Prevents returning deleted messages
messageSchema.pre("find", function () {
  this.where({ isDeleted: false });
});

const Message = model("Message", messageSchema);
export default Message;
