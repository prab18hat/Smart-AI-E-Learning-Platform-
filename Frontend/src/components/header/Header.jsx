import React from "react";
import "./header.css";
import { Link, NavLink } from "react-router-dom";
import { UserData } from "../../context/UserContext";

const Header = ({ isAuth }) => {
    const { user } = UserData();
    return (
        <header>
            <div className="logo">CoddyCulture</div>

            <div className="link">
                <Link to={"/"}>Home</Link>
                <Link to={"/courses"}>Courses</Link>
                <Link to={"/about"}>About</Link>
                {isAuth && (
                    <>
                        <NavLink to="/quizzes" className={({ isActive }) => (isActive ? "active" : "")}>Quizzes</NavLink>
                        <NavLink to="/leaderboard" className={({ isActive }) => (isActive ? "active" : "")}>Leaderboard</NavLink>
                        <NavLink to="/badges" className={({ isActive }) => (isActive ? "active" : "")}>Badges</NavLink>
                        <NavLink to="/rewards" className={({ isActive }) => (isActive ? "active" : "")}>Rewards</NavLink>
                    </>
                )}
                {isAuth ? (
                    <Link to={"/account"}>Account</Link>
                ) : (
                    <Link to={"/login"}>Login</Link>
                )}
            </div>
        </header>
    );
};

export default Header;