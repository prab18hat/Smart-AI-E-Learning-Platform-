import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import {
  generateQuiz,
  getQuizzes,
  attemptQuiz,
  getLeaderboard,
  getBadges,
  getRewards,
  deleteQuiz,
  updateQuiz
} from "../controllers/quizController.js";

const router = express.Router();

// Generate a quiz from content (admin/teacher)
router.post("/generate", isAuth, generateQuiz);
// List quizzes (optionally by course)
router.get("/", isAuth, getQuizzes);
// Attempt a quiz
router.post("/attempt", isAuth, attemptQuiz);
// Leaderboard
router.get("/leaderboard", isAuth, getLeaderboard);
// User badges
router.get("/badges", isAuth, getBadges);
// Rewards
router.get("/rewards", isAuth, getRewards);

// Delete quiz
router.delete("/:id", isAuth, deleteQuiz);
// Update quiz
router.put("/:id", isAuth, updateQuiz);

export default router;
