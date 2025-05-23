import React, { useEffect, useState } from "react";
import axios from "axios";
import { server } from "../../main";

const Badges = () => {
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    axios.get(`${server}/api/quizzes/badges`, { headers: { token: localStorage.getItem("token") } })
      .then(res => setBadges(res.data.badges))
      .catch(() => setBadges([]));
  }, []);

  return (
    <div className="badges-page">
      <h2>Your Badges</h2>
      <div className="badges-list">
        {badges.map(b => (
          <div key={b._id} className="badge-item">
            <img src={b.icon || "/badge-placeholder.png"} alt={b.name} style={{ width: 48 }} />
            <div>{b.name}</div>
            <small>{b.description}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Badges;
