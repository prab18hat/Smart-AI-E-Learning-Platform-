import mongoose from "mongoose";

const RewardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  pointsRequired: { type: Number, required: true },
  image: { type: String }, // URL for reward image
  active: { type: Boolean, default: true },
});

export const Reward = mongoose.model("Reward", RewardSchema);
