import React, { useEffect, useState } from "react";
import api from "../../api/api";
import './CompanyDashboard.css'
const CompanyHome = () => {
    const [stats, setStats] = useState({
        totalInternships: 0,
        activeInternships: 0,
        totalApplications: 0,
    });
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const res = await api.get("/company/dashboard-stats");
            setStats(res.data);
            setLoading(false);
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading) return <h3>Loading...</h3>;

    return (
        <>

            <div className="stats-container">
                <div className="stat-card">
                    <h3>Total Internships</h3>
                    <p>{stats.totalInternships}</p>
                </div>

                <div className="stat-card">
                    <h3>Active Internships</h3>
                    <p>{stats.activeInternships}</p>
                </div>

                <div className="stat-card">
                    <h3>Total Applications</h3>
                    <p>{stats.totalApplications}</p>
                </div>
            </div>
        </>
    );
};

export default CompanyHome;
