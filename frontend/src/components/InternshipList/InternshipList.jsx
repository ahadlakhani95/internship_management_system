import React, { useEffect, useState } from "react";
import { getAllInternships } from "../../api/api";
import "./internshiplist.css";
import { Navigate, useNavigate } from "react-router-dom";
const InternshipList = () => {

    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const fetchInternships = async () => {
        try {
            const res = await getAllInternships();
            setInternships(res.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInternships();
    }, []);

    if (loading) return <p style={{ padding: 30 }}>Loading...</p>;

    return (
        <div className="student-grid">

            {internships.map((item) => (
                <div className="student-card" key={item._id}>

                    <div className="student-header">
                        <h3>{item.title}</h3>
                        <span className="company">{item.companyId?.companyName}</span>
                    </div>

                    <p className="desc">{item.description}</p>

                    <div className="student-details">
                        <span>📍 {item.location}</span>
                        <span>⏳ {item.duration}</span>
                        <span>💰 ₹{item.stipend}</span>
                    </div>

                    <div className="student-skills">
                        {item.skillsRequired.map((skill, i) => (
                            <span key={i}>{skill}</span>
                        ))}
                    </div>

                    <button onClick={() => navigate(`/student/apply/${item._id}`)}>
                        Apply Now
                    </button>


                </div>
            ))}

        </div>
    );
};

export default InternshipList;
