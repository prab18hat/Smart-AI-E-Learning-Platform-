import { Quiz } from "../models/quiz.js";
import { QuizAttempt } from "../models/QuizAttempt.js";
import { User } from "../models/user.js";
import { Badge } from "../models/Badge.js";
import { Reward } from "../models/Reward.js";
import TryCatch from "../middlewares/TryCatch.js";
import axios from "axios";

// Grok AI endpoint and API key setup
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Use the same key as your chatbot


// (1) Generate Quiz from content (NLP)
export const generateQuiz = TryCatch(async (req, res) => {
  const { courseId, content, title, questions: frontendQuestions } = req.body;
  // Validate required fields
  if (!courseId || !title) {
    return res.status(400).json({ message: "Missing required fields: courseId and title are required." });
  }
  // Validate courseId is a valid ObjectId and course exists
  if (!/^[a-fA-F0-9]{24}$/.test(courseId)) {
    return res.status(400).json({ message: "Invalid courseId format." });
  }
  const course = await import("../models/Courses.js").then(m => m.Courses.findById(courseId));
  if (!course) {
    return res.status(404).json({ message: "Course not found." });
  }

  let questions = [];

  // If manual questions are provided from frontend, use them as-is and do not call AI
  if (Array.isArray(frontendQuestions) && frontendQuestions.length > 0) {
    questions = frontendQuestions;
  } else {
    try {
      // Use OpenAI API (same as chatbot) to generate MCQs
      const systemPrompt = `You are a quiz generator for an e-learning platform. Given a course title and content, generate 5 multiple-choice questions (MCQs) relevant to the course. Return the result as a JSON array of objects, each with: question, options (array of 4), and answer (the correct option).`;
      const userPrompt = `Course: ${course.title}\nContent: ${content || "(no extra content)"}`;
      const response = await axios.post(
        OPENAI_API_URL,
        {
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          max_tokens: 800,
          temperature: 0.7
        },
        {
          headers: {
            "Authorization": `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );
      // Parse JSON from OpenAI response
      let aiText = response.data.choices?.[0]?.message?.content || "";
      let parsed;
      try {
        parsed = JSON.parse(aiText);
      } catch {
        // Try to extract JSON from text
        const match = aiText.match(/\[.*\]/s);
        parsed = match ? JSON.parse(match[0]) : [];
      }
      if (!Array.isArray(parsed) || parsed.length === 0) throw new Error("No valid questions from AI");
      // Validate each question structure
      questions = parsed.filter(q => q && typeof q.question === "string" && Array.isArray(q.options) && q.options.length === 4 && typeof q.answer === "string");
      if (questions.length === 0) throw new Error("No valid questions from AI");
    } catch (error) {
      // Log Grok API error for debugging
      console.error("Grok AI API error:", error?.response?.data || error.message || error);
      // Fallback: static questions if Grok fails
      questions = [
        {
          question: `What is the main topic of the course '${course.title}'?`,
          options: ["A", "B", "C", "D"],
          answer: "A"
        }
      ];
    }
  }

  const quiz = await Quiz.create({
    courseId,
    title,
    questions,
    createdBy: req.user._id,
  });
  res.status(201).json({ quiz });
});

// (2) Get all quizzes for a course
export const getQuizzes = TryCatch(async (req, res) => {
  const { courseId } = req.query;
  const quizzes = await Quiz.find(courseId ? { courseId } : {});
  res.json({ quizzes });
});

// (3) Attempt a quiz
export const attemptQuiz = TryCatch(async (req, res) => {
  const { quizId, answers } = req.body;
  const quiz = await Quiz.findById(quizId);
  let score = 0;
  let pointsEarned = 0;
  const attemptAnswers = quiz.questions.map((q, idx) => {
    const userAns = answers[idx];
    const correct = userAns === q.answer;
    if (correct) {
      score++;
      pointsEarned += 10; // 10 points per correct
    }
    return {
      questionId: q._id,
      selected: userAns,
      correct,
    };
  });
  const attempt = await QuizAttempt.create({
    user: req.user._id,
    quiz: quizId,
    answers: attemptAnswers,
    score,
    pointsEarned,
  });
  // Update user points
  await User.findByIdAndUpdate(req.user._id, {
    $inc: { points: pointsEarned },
    $push: { quizAttempts: attempt._id },
  });
  res.json({ score, pointsEarned, attempt });
});

// (4) Leaderboard
export const getLeaderboard = TryCatch(async (req, res) => {
  const users = await User.find({}, "name points profilePic").sort({ points: -1 }).limit(20);
  res.json({ leaderboard: users });
});

// (5) Get Badges (stub)
export const getBadges = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id).populate("badges");
  res.json({ badges: user.badges });
});

// (6) Get Rewards (stub)
export const getRewards = TryCatch(async (req, res) => {
  const rewards = await Reward.find({ active: true });
  res.json({ rewards });
});

// (7) Delete Quiz
export const deleteQuiz = TryCatch(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) return res.status(404).json({ message: "Quiz not found." });
  if (quiz.createdBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    return res.status(403).json({ message: "Not authorized to delete this quiz." });
  }
  await quiz.deleteOne();
  res.json({ message: "Quiz deleted successfully." });
});

// (8) Update Quiz
export const updateQuiz = TryCatch(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) return res.status(404).json({ message: "Quiz not found." });
  if (quiz.createdBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    return res.status(403).json({ message: "Not authorized to update this quiz." });
  }
  const { title, questions, schedule } = req.body;
  if (title) quiz.title = title;
  if (questions) quiz.questions = questions;
  if (schedule !== undefined) quiz.schedule = schedule;
  await quiz.save();
  res.json({ message: "Quiz updated successfully.", quiz });
});
