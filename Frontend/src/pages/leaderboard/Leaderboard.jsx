import React, { useEffect, useState } from "react";
import axios from "axios";
import { server } from "../../main";

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    axios.get(`${server}/api/quizzes/leaderboard`, { headers: { token: localStorage.getItem("token") } })
      .then(res => setLeaders(res.data.leaderboard))
      .catch(() => setLeaders([]));
  }, []);

  return (
    <div className="leaderboard-page">
      <h2>Leaderboard</h2>
      <ol>
        {leaders.map((u, i) => (
          <li key={u._id}>
            <img src={u.profilePic || "/default-avatar.png"} alt="avatar" style={{ width: 32, borderRadius: "50%" }} />
            <span>{u.name}</span> — <b>{u.points} pts</b>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Leaderboard;
