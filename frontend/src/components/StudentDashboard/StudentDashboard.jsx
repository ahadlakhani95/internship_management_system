import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import "./StudentDashboard.css";

// Import Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSignOutAlt,
    faChartBar,
    faBriefcase,
    faFileAlt,
    faSearch,
    faCalendarAlt,
    faSyncAlt,
    faMapMarkerAlt,
    faClock,
    faCheckCircle,
    faHourglassHalf,
    faTimesCircle,
    faClipboardList,
    faUser,
    faBuilding,
    faFilter
} from '@fortawesome/free-solid-svg-icons';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState("dashboard");
    const [internships, setInternships] = useState([]);
    const [applications, setApplications] = useState([]);
    const [stats, setStats] = useState({
        applied: 0,
        shortlisted: 0,
        accepted: 0,
        rejected: 0
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    useEffect(() => {

        // Fetch internships
        api.get("/internships").then(res => setInternships(res.data));

        // Fetch applications
        api.get("/applications/student").then(res => {
            setApplications(res.data);
            calculateStats(res.data);
        });
    }, []);

    const calculateStats = (apps) => {
        const statusCounts = apps.reduce((acc, app) => {
            acc[app.status] = (acc[app.status] || 0) + 1;
            return acc;
        }, {});

        setStats({
            applied: apps.length,
            shortlisted: statusCounts.shortlisted || 0,
            accepted: statusCounts.accepted || 0,
            rejected: statusCounts.rejected || 0
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: "#FFA500", // Orange
            shortlisted: "#4169E1", // Royal Blue
            accepted: "#2E8B57", // Sea Green
            rejected: "#DC143C" // Crimson
        };
        return colors[status?.toLowerCase()] || "#6A5ACD"; // Slate Blue as default
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const filteredInternships = internships.filter(internship =>
        internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const filteredApplications = applications.filter(app =>
        filterStatus === "all" ||
        app.status?.toLowerCase() === filterStatus.toLowerCase()
    );


    const statCards = [
        {
            id: 1,
            title: "Total Applied",
            value: stats.applied,
            icon: faClipboardList,
            color: "#4A90E2",
            bgColor: "#E8F4FD"
        },
        {
            id: 2,
            title: "Accepted",
            value: stats.accepted,
            icon: faCheckCircle,
            color: "#2E8B57",
            bgColor: "#E8F8EF"
        },
        {
            id: 3,
            title: "Shortlisted",
            value: stats.shortlisted,
            icon: faHourglassHalf,
            color: "#FFA500",
            bgColor: "#FFF5E6"
        },
        {
            id: 4,
            title: "Rejected",
            value: stats.rejected,
            icon: faTimesCircle,
            color: "#DC143C",
            bgColor: "#FDE8E8"
        }
    ];

    const navItems = [
        { id: "dashboard", label: "Dashboard", icon: faChartBar },
        { id: "internships", label: "Internships", icon: faBriefcase },
        { id: "applications", label: "My Applications", icon: faFileAlt }
    ];

    return (
        <div className="student-dashboard">
            {/* Header */}
            <header className="dashboard-header">
                <div className="header-left">
                    <div className="logo-container">
                        <div className="logo-icon">
                            <FontAwesomeIcon icon={faBriefcase} />
                        </div>
                        <h1 className="logo">Internship Management System</h1>
                    </div>
                </div>
                <div className="header-right">
                    <button
                        className="logout-btn"
                        onClick={() => navigate("/login")}
                    >
                        <FontAwesomeIcon icon={faSignOutAlt} />
                        <span>Logout</span>
                    </button>
                </div>
            </header>

            {/* Navigation */}
            <nav className="dashboard-nav">
                <div className="nav-tabs">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            className={`nav-btn ${page === item.id ? "active" : ""}`}
                            onClick={() => setPage(item.id)}
                        >
                            <FontAwesomeIcon icon={item.icon} className="nav-icon" />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </div>
            </nav>

            {/* Main Content */}
            <main className="dashboard-main">
                {/* Dashboard Page */}
                {page === "dashboard" && (
                    <div className="dashboard-content">
                        {/* Welcome Banner */}
                        <div className="welcome-banner">
                            <div className="welcome-text">
                                <h2>Welcome back!</h2>
                                <p>Track your internship journey and discover new opportunities</p>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="stats-grid">
                            {statCards.map((stat) => (
                                <div
                                    key={stat.id}
                                    className="stat-card"
                                    style={{
                                        backgroundColor: stat.bgColor,
                                        borderLeft: `4px solid ${stat.color}`
                                    }}
                                >
                                    <div className="stat-icon-container">
                                        <FontAwesomeIcon
                                            icon={stat.icon}
                                            style={{ color: stat.color }}
                                        />
                                    </div>
                                    <div className="stat-content">
                                        <h3 className="stat-value">{stat.value}</h3>
                                        <p className="stat-label">{stat.title}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Recent Applications */}
                        <div className="section">
                            <div className="section-header">
                                <h3>Recent Applications</h3>
                                <button
                                    className="view-all-btn"
                                    onClick={() => setPage("applications")}
                                >
                                    View All Applications
                                </button>
                            </div>
                            <div className="applications-grid">
                                {applications.slice(0, 3).map(application => (
                                    <div key={application._id} className="application-card">
                                        <div className="application-header">
                                            <h4>{application.internshipId?.title || "Untitled Internship"}</h4>
                                            <span
                                                className="status-badge"
                                                style={{ backgroundColor: getStatusColor(application.status) }}
                                            >
                                                {application.status || "Pending"}
                                            </span>
                                        </div>
                                        <div className="application-company">
                                            <FontAwesomeIcon icon={faBuilding} />
                                            <span>{application.internshipId?.company || "Company Not Specified"}</span>
                                        </div>
                                        <div className="application-date">
                                            <FontAwesomeIcon icon={faCalendarAlt} />
                                            <span>Applied on: {formatDate(application.appliedDate)}</span>
                                        </div>
                                    </div>
                                ))}
                                {applications.length === 0 && (
                                    <div className="empty-state">
                                        <p>No applications yet. Start applying to internships!</p>
                                        <button
                                            className="primary-btn"
                                            onClick={() => setPage("internships")}
                                        >
                                            Browse Internships
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Internships Page */}
                {page === "internships" && (
                    <div className="internships-content">
                        <div className="section-header">
                            <h2>Available Internships</h2>
                            <div className="search-box">
                                <FontAwesomeIcon icon={faSearch} className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search internships..."
                                    className="search-input"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="internships-grid">
                            {filteredInternships.map(internship => (
                                <div key={internship._id} className="internship-card">
                                    <div className="internship-header">
                                        <h3>{internship.title}</h3>
                                        <span className="internship-type">
                                            {internship.type || "Full-time"}
                                        </span>
                                    </div>
                                    <div className="internship-company">
                                        <FontAwesomeIcon icon={faBuilding} />
                                        <span>{internship.company || "Company Not Specified"}</span>
                                    </div>
                                    <p className="internship-description">
                                        {internship.description?.substring(0, 150)}...
                                    </p>
                                    <div className="internship-footer">
                                        <div className="internship-location">
                                            <FontAwesomeIcon icon={faMapMarkerAlt} />
                                            <span>{internship.location || "Remote"}</span>
                                        </div>
                                        <button
                                            className="apply-btn"
                                            onClick={() => navigate(`/student/apply/${internship._id}`)}
                                        >
                                            Apply Now
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {filteredInternships.length === 0 && (
                                <div className="empty-state">
                                    <p>No internships match your search. Try different keywords.</p>
                                    {searchTerm && (
                                        <button
                                            className="secondary-btn"
                                            onClick={() => setSearchTerm("")}
                                        >
                                            Clear Search
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Applications Page */}
                {page === "applications" && (
                    <div className="applications-content">
                        <div className="section-header">
                            <h2>My Applications</h2>
                            <div className="filter-options">
                                <FontAwesomeIcon icon={faFilter} className="filter-icon" />
                                <select
                                    className="filter-select"
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                >
                                    <option value="all">All Status</option>
                                    <option value="APPLIED">APPLIED</option>
                                    <option value="SELECTED">SELECTED</option>
                                    <option value="REJECTED">REJECTED</option>
                                </select>
                            </div>
                        </div>

                        <div className="applications-list">
                            {filteredApplications.map(application => (
                                <div key={application._id} className="application-item">
                                    <div className="application-info">
                                        <h4>{application.internshipId?.title || "Untitled Internship"}</h4>
                                        <div className="application-company">
                                            <FontAwesomeIcon icon={faBuilding} />
                                            <span>{application.internshipId?.company || "Company Not Specified"}</span>
                                        </div>
                                        <div className="application-meta">
                                            <span className="meta-item">
                                                <FontAwesomeIcon icon={faCalendarAlt} />
                                                Applied: {formatDate(application.appliedDate)}
                                            </span>
                                            {application.updatedDate && (
                                                <span className="meta-item">
                                                    <FontAwesomeIcon icon={faSyncAlt} />
                                                    Updated: {formatDate(application.updatedDate)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="application-status">
                                        <span
                                            className="status-indicator"
                                            style={{ backgroundColor: getStatusColor(application.status) }}
                                        ></span>
                                        <span className="status-text">{application.status || "Pending"}</span>
                                    </div>
                                </div>
                            ))}
                            {filteredApplications.length === 0 && (
                                <div className="empty-state">
                                    <p>No applications found with the selected filter.</p>
                                    <button
                                        className="primary-btn"
                                        onClick={() => {
                                            setFilterStatus("all");
                                            setPage("internships");
                                        }}
                                    >
                                        Browse Internships
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default StudentDashboard;