import { Schema, model } from "mongoose";

// creating a schema for model
const userSchema = new Schema(
  {
    username: {
      type: String,
    },
    googleId: {
      type: String,
    },
    thumbNail: {
      type: String,
    },
  },
  { timestamps: true }
);

export default model("users", userSchema);
