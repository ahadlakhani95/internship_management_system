import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    const logout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/">Internship Management</Link>
            </div>
            <ul className="navbar-links">
                <li>
                    <Link to="/">Home</Link>
                </li>
                {!token && (
                    <>
                        <li>
                            <Link to="/login">Login</Link>
                        </li>
                        <li>
                            <Link to="/register">Register</Link>
                        </li>
                    </>
                )}
                {token && role === "STUDENT" && (
                    <li>
                        <Link to="/student/dashboard">Dashboard</Link>
                    </li>
                )}
                {token && role === "COMPANY" && (
                    <li>
                        <Link to="/company/dashboard">Dashboard</Link>
                    </li>
                )}
                {token && (
                    <li>
                        <button className="logout-btn" onClick={logout}>
                            Logout
                        </button>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
