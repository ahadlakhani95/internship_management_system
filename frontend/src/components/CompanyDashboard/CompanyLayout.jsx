import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "./CompanyDashboard.css";
import { BsFillHouseFill } from "react-icons/bs";
import { LuCircleFadingPlus } from "react-icons/lu";
import { RiFilePaper2Fill } from "react-icons/ri";
import { MdOutlineDownloading } from "react-icons/md";
const CompanyLayout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <div className="dashboard-wrapper">

            {/* Sidebar */}
            <div className="sidebar">

                <h2 className="logo">Company</h2>

                <ul>
                    <li onClick={() => navigate("/company/dashboard")}><BsFillHouseFill /> Dashboard</li>
                    <li onClick={() => navigate("/company/add-internship")}><LuCircleFadingPlus /> Add Internship</li>
                    <li onClick={() => navigate("/company/internships")}><RiFilePaper2Fill /> Manage Internships</li>
                    <li onClick={() => navigate("/company/applications")}><MdOutlineDownloading /> Applications</li>

                    {/* Logout button */}
                    <button className="logout-btn" onClick={handleLogout}>
                        Logout
                    </button>
                </ul>


            </div>

            {/* Right Side Dynamic Content */}
            <div className="dashboard-content">
                <Outlet />
            </div>

        </div>
    );
};

export default CompanyLayout;
