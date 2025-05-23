import React, { useEffect, useState } from "react";
import axios from "axios";
import { server } from "../../main";
import "./quizattempt.css";

const QuizAttempt = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [pointsEarned, setPointsEarned] = useState(null);
  const [totalPoints, setTotalPoints] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch all available quizzes for the student
  useEffect(() => {
    setLoading(true);
    axios.get(`${server}/api/quizzes`, { headers: { token: localStorage.getItem("token") } })
      .then(res => setQuizzes(res.data.quizzes || []))
      .catch(() => setQuizzes([]))
      .finally(() => setLoading(false));
  }, []);

  // Start attempting a quiz
  const startQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setAnswers(Array(quiz.questions.length).fill(""));
    setScore(null);
    setError("");
    setSuccess("");
  };

  // Handle answer selection
  const handleAnswerChange = (qIdx, value) => {
    setAnswers(ans => ans.map((a, i) => i === qIdx ? value : a));
  };

  // Submit answers for scoring
  const submitQuiz = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await axios.post(`${server}/api/quizzes/attempt`, {
        quizId: selectedQuiz._id,
        answers,
      }, { headers: { token: localStorage.getItem("token") } });
      setScore(res.data.score);
      setPointsEarned(res.data.pointsEarned);
      setSuccess(`You scored ${res.data.score} / ${selectedQuiz.questions.length}!`);
      // Fetch user's total points after quiz attempt
      const userRes = await axios.get(`${server}/api/users/me`, { headers: { token: localStorage.getItem("token") } });
      setTotalPoints(userRes.data.user?.points ?? null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit quiz. Please try again.");
    }
    setLoading(false);
  };

  // Reset to quiz list
  const reset = () => {
    setSelectedQuiz(null);
    setAnswers([]);
    setScore(null);
    setError("");
    setSuccess("");
  };

  return (
    <div className="quiz-attempt-container">
      <h2>Available Quizzes</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="quiz-error">{error}</div>}
      {success && <div className="quiz-success">{success}</div>}
      {!selectedQuiz && (
        <div className="quiz-list">
          {quizzes.length === 0 && <div>No quizzes available.</div>}
          {quizzes.map(quiz => (
            <div className="quiz-list-item" key={quiz._id}>
              <span className="quiz-title">{quiz.title}</span>
              <button className="start-quiz-btn" onClick={() => startQuiz(quiz)}>
                Attempt Quiz
              </button>
            </div>
          ))}
        </div>
      )}
      {selectedQuiz && (
        <div className="quiz-attempt-panel">
          <h3>{selectedQuiz.title}</h3>
          <form onSubmit={e => { e.preventDefault(); submitQuiz(); }}>
            {selectedQuiz.questions.map((q, idx) => (
              <div className="quiz-question-block" key={idx}>
                <div className="quiz-question">Q{idx + 1}: {q.question}</div>
                <div className="quiz-options">
                  {q.options.map((opt, oi) => (
                    <label key={oi} className="quiz-option-label">
                      <input
                        type="radio"
                        name={`question-${idx}`}
                        value={opt}
                        checked={answers[idx] === opt}
                        onChange={() => handleAnswerChange(idx, opt)}
                        required
                        disabled={score !== null}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            ))}
            {score === null && (
              <button className="submit-quiz-btn" type="submit" disabled={loading}>
                Submit Quiz
              </button>
            )}
            {score !== null && (
              <div className="quiz-results-panel">
                <div className="quiz-score">Score: <b>{score} / {selectedQuiz.questions.length}</b></div>
                {pointsEarned !== null && (
                  <div className="quiz-points-earned">Points earned: <b>{pointsEarned}</b></div>
                )}
                {totalPoints !== null && (
                  <div className="quiz-total-points">Your total quiz points: <b>{totalPoints}</b></div>
                )}
                <button className="reset-quiz-btn" type="button" onClick={reset}>
                  Back to Quiz List
                </button>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default QuizAttempt;
