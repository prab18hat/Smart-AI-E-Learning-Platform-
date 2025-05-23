import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../main";
import { FaChevronLeft, FaChevronRight, FaCheckCircle, FaTrophy } from "react-icons/fa";
import "./takequiz.css";

const TakeQuiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    axios.get(`${server}/api/quizzes`, { headers: { token: localStorage.getItem("token") } })
      .then(res => {
        const q = res.data.quizzes.find(qz => qz._id === quizId);
        setQuiz(q);
        setAnswers(new Array(q?.questions.length).fill(""));
        setLoading(false);
      })
      .catch(() => {
        setError("Quiz not found or failed to load.");
        setLoading(false);
      });
  }, [quizId]);

  const handleChange = (value) => {
    setAnswers(a => a.map((v, i) => (i === current ? value : v)));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/quizzes/attempt`, {
        quizId,
        answers,
      }, { headers: { token: localStorage.getItem("token") } });
      setResult(data);
    } catch {
      setError("Failed to submit quiz. Please try again.");
    }
    setLoading(false);
  };

  if (loading) return <div className="quiz-loading">Loading...</div>;
  if (error) return <div className="quiz-error">{error}</div>;

  if (!quiz) return <div className="quiz-error">Quiz not found.</div>;

  if (result) return (
    <div className="quiz-result">
      <h2><FaTrophy color="#ffc107" /> Quiz Result</h2>
      <div className="quiz-result-score">
        <span>Score: <b>{result.score}</b> / {quiz.questions.length}</span>
        <span>Points Earned: <b style={{ color: '#007bff' }}>{result.pointsEarned}</b></span>
      </div>
      <div className="quiz-result-summary">
        <h4>Question Summary</h4>
        <ul>
          {quiz.questions.map((q, idx) => (
            <li key={q._id}>
              <span>{idx + 1}. {q.question}</span>
              <span style={{ marginLeft: 8 }}>
                {result.attempt.answers[idx]?.correct ? (
                  <FaCheckCircle color="#28a745" title="Correct" />
                ) : (
                  <span style={{ color: "#dc3545" }}>✗</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <button className="quiz-home-btn" onClick={() => navigate("/quizzes")}>Back to Quizzes</button>
    </div>
  );

  const q = quiz.questions[current];

  return (
    <div className="take-quiz-page">
      <div className="quiz-progress">
        Question {current + 1} of {quiz.questions.length}
      </div>
      <div className="quiz-question-card">
        <div className="quiz-question-title">{q.question}</div>
        <div className="quiz-options">
          {q.options.map(opt => (
            <label key={opt} className={`quiz-option${answers[current] === opt ? " selected" : ""}`}>
              <input
                type="radio"
                name={`q${current}`}
                value={opt}
                checked={answers[current] === opt}
                onChange={() => handleChange(opt)}
                required
              />
              {opt}
            </label>
          ))}
        </div>
      </div>
      <div className="quiz-nav-btns">
        <button disabled={current === 0} onClick={() => setCurrent(c => c - 1)}><FaChevronLeft /> Prev</button>
        {current < quiz.questions.length - 1 ? (
          <button disabled={!answers[current]} onClick={() => setCurrent(c => c + 1)}>Next <FaChevronRight /></button>
        ) : (
          <button className="quiz-submit-btn" disabled={answers.includes("")} onClick={handleSubmit}>Submit Quiz</button>
        )}
      </div>
    </div>
  );
};

export default TakeQuiz;
