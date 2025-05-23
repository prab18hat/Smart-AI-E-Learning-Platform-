import mongoose from "mongoose";

const BadgeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  icon: { type: String }, // URL or icon name
  criteria: { type: String }, // e.g., "100 points", "10 quizzes"
});

export const Badge = mongoose.model("Badge", BadgeSchema);
