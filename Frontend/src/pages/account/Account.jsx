import React from "react";
import { MdDashboard } from "react-icons/md";
import "./account.css";
import { IoMdLogOut } from "react-icons/io";
import { UserData } from "../../context/UserContext";
import ProfileImageUploader from "./ProfileImageUploader";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Account = ({ user }) => {
  const { setIsAuth, setUser } = UserData();

  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.clear();
    setUser([]);
    setIsAuth(false);
    toast.success("Logged Out");
    navigate("/login");
  };

  return (
    <div>
      {user && (
        <div className="profile">
          <h2>My Profile</h2>
          <ProfileImageUploader user={user} />
          <div className="profile-stats">
            <div><b>Points:</b> {user?.points || 0}</div>
            <div><b>Badges:</b> {user?.badges?.length || 0}</div>
          </div>

          {(user?.role === "admin" || user?.role === "superadmin") && (
            <div className="admin-dashboard-section" style={{ marginTop: 32 }}>
              <h3>Admin Dashboard</h3>
              <div className="admin-dashboard-cards">
                <div
                  className="admin-dashboard-card"
                  tabIndex={0}
                  role="button"
                  aria-label="Quiz Management"
                  title="Quiz Management: Add, Create, or Delete Quizzes"
                  style={{
                    background: '#f8fafd',
                    borderRadius: 10,
                    boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
                    padding: '18px 12px',
                    marginBottom: 12,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    cursor: 'pointer',
                    transition: 'box-shadow 0.17s, border 0.17s',
                    border: '1.5px solid #e0e0e0'
                  }}
                  onClick={() => window.location.href = "/admin/quizzes"}
                  onKeyPress={e => { if (e.key === 'Enter' || e.key === ' ') window.location.href = "/admin/quizzes"; }}
                >
                  <svg height="32" width="32" viewBox="0 0 32 32" fill="#007bff" aria-hidden="true"><circle cx="16" cy="16" r="15" stroke="#007bff" strokeWidth="2" fill="#e8f0fe" /><rect x="15" y="8" width="2" height="16" rx="1" fill="#007bff"/><rect x="8" y="15" width="16" height="2" rx="1" fill="#007bff"/></svg>
                  <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>Quiz Management</span>
                  <span style={{ color: '#007bff', fontSize: '0.97rem' }}>Add / Create / Delete Quiz</span>
                </div>
              </div>
            </div>
          )}

          <div className="profile-info">
            <p>
              <strong>Name - {user.name}</strong>
            </p>
            <p>
              <strong>Email - {user.email}</strong>
            </p>
            <p>
              <strong>Points - {user.points || 0}</strong>
            </p>
            {user.badges && user.badges.length > 0 && (
              <div className="profile-badges">
                <strong>Badges:</strong>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
                  {user.badges.map(b => (
                    <span key={b._id || b} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <img src={b.icon || "/badge-placeholder.png"} alt={b.name || "Badge"} style={{ width: 24, height: 24 }} />
                      <span>{b.name || "Badge"}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}


            <button
              onClick={() => navigate(`/${user._id}/dashboard`)}
              className="common-btn"
            >
              <MdDashboard />
              Dashboard
            </button>

            <br />

            {user.role === "admin" && (
              <button
                onClick={() => navigate(`/admin/dashboard`)}
                className="common-btn"
              >
                <MdDashboard />
                Admin Dashboard
              </button>
            )}

            <br />

            <button
              onClick={logoutHandler}
              className="common-btn"
              style={{ background: "red" }}
            >
              <IoMdLogOut />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;