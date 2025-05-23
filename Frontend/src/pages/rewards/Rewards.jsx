import React, { useEffect, useState } from "react";
import axios from "axios";
import { server } from "../../main";

const Rewards = () => {
  const [rewards, setRewards] = useState([]);

  useEffect(() => {
    axios.get(`${server}/api/quizzes/rewards`, { headers: { token: localStorage.getItem("token") } })
      .then(res => setRewards(res.data.rewards))
      .catch(() => setRewards([]));
  }, []);

  return (
    <div className="rewards-page">
      <h2>Rewards & Future Shop</h2>
      <ul>
        {rewards.map(r => (
          <li key={r._id}>
            <img src={r.image || "/reward-placeholder.png"} alt={r.title} style={{ width: 48 }} />
            <span>{r.title}</span> — <b>{r.pointsRequired} pts</b>
            <div>{r.description}</div>
          </li>
        ))}
      </ul>
      <p>More features coming soon: redeem points for goodies, discounts, and more!</p>
    </div>
  );
};

export default Rewards;
