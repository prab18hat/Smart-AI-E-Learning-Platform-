import mongoose from "mongoose";

const QuizAttemptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  answers: [{
    questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    selected: { type: String, required: true },
    correct: { type: Boolean, required: true },
  }],
  score: { type: Number, required: true },
  pointsEarned: { type: Number, required: true },
  attemptedAt: { type: Date, default: Date.now },
});

export const QuizAttempt = mongoose.model("QuizAttempt", QuizAttemptSchema);
