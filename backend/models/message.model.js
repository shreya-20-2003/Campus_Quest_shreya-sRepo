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
    read: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt timestamps
  }
);

const Message = model("Message", messageSchema);
export default Message;
