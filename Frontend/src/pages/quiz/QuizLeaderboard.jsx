import React, { useEffect, useState } from "react";
import axios from "axios";
import { server } from "../../main";
import "./quizleaderboard.css";

const QuizLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get(`${server}/api/quizzes/leaderboard`, { headers: { token: localStorage.getItem("token") } })
      .then(res => setLeaderboard(res.data.leaderboard || []))
      .catch(() => setLeaderboard([]))
      .finally(() => setLoading(false));
    // Optionally fetch current user info for highlighting
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  return (
    <div className="quiz-leaderboard-container">
      <h2>Quiz Leaderboard</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="quiz-error">{error}</div>}
      <div className="leaderboard-table-wrapper">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.length === 0 && (
              <tr><td colSpan={3}>No leaderboard data available.</td></tr>
            )}
            {leaderboard.map((item, idx) => (
              <tr key={item._id} className={user && item._id === user._id ? "highlight-row" : ""}>
                <td>{idx + 1}</td>
                <td>{item.name}</td>
                <td>{item.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuizLeaderboard;
