import React, { useEffect, useState } from "react";
import axios from "axios";
import { server } from "../../main";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaTrophy, FaCheckCircle, FaQuestionCircle } from "react-icons/fa";
import "./quizzes.css";

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [search, setSearch] = useState("");
  const [attempts, setAttempts] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${server}/api/quizzes`, { headers: { token: localStorage.getItem("token") } })
      .then(res => setQuizzes(res.data.quizzes))
      .catch(() => setQuizzes([]));
    // Fetch user's quiz attempts
    axios.get(`${server}/api/user`, { headers: { token: localStorage.getItem("token") } })
      .then(res => {
        const attemptMap = {};
        (res.data.user.quizAttempts || []).forEach(a => {
          attemptMap[a.quiz] = a;
        });
        setAttempts(attemptMap);
      })
      .catch(() => setAttempts({}));
  }, []);

  const filtered = quizzes.filter(q => q.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="quizzes-page">
      <div className="quizzes-header">
        <h2><FaQuestionCircle style={{ marginRight: 8, color: "#007bff" }} />Quizzes & Tests</h2>
        <div className="quizzes-search">
          <FaSearch />
          <input
            type="text"
            placeholder="Search quizzes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="quizzes-list">
        {filtered.length === 0 ? (
          <div className="no-quizzes">
            <img src="/no-quizzes.svg" alt="No Quizzes" style={{ width: 140, marginBottom: 16, opacity: 0.8 }} />
            <div>No quizzes available at the moment.</div>
            <div style={{ marginTop: 10, color: '#007bff', fontWeight: 500 }}>
              {localStorage.getItem('role') === 'admin'
                ? 'Start by creating your first quiz from the admin panel!'
                : 'Please check back later or ask your instructor to add quizzes.'}
            </div>
          </div>
        ) : (
          filtered.map(q => (
            <div className="quiz-card interactive" key={q._id}>
              <div className="quiz-card-header">
                <FaTrophy style={{ color: "#ffc107", fontSize: 24, marginRight: 8 }} />
                <span className="quiz-title">{q.title}</span>
              </div>
              <div className="quiz-meta">
                <span className="quiz-points">Max Points: {q.questions.length * 10}</span>
                {attempts[q._id] ? (
                  <span className="quiz-attempted">
                    <FaCheckCircle color="#28a745" /> Attempted: {attempts[q._id].score} / {q.questions.length}
                  </span>
                ) : (
                  <span className="quiz-not-attempted">Not Attempted</span>
                )}
              </div>
              <button
                className="quiz-take-btn prominent"
                onClick={() => navigate(`/quiz/take/${q._id}`)}
                tabIndex={0}
                aria-label={`Take quiz: ${q.title}`}
              >
                {attempts[q._id] ? "Retake Quiz" : "Take Quiz"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Quizzes;
