import React, { useEffect, useState } from "react";
import { getCompanyInternships, closeInternship } from "../../api/api";
import { useNavigate } from "react-router-dom";
import "./manageintership.css";
import { FiEye, FiEdit2, FiCalendar, FiUsers, FiMapPin, FiClock, FiDollarSign } from "react-icons/fi";

const ManageInternship = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchInternships = async () => {
    try {
      setLoading(true);
      const res = await getCompanyInternships();
      setInternships(res.data);
    } catch (err) {
      console.error("Error fetching internships:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  const handleClose = async (id) => {
    if (window.confirm("Are you sure you want to close this internship? This action cannot be undone.")) {
      try {
        await closeInternship(id);
        fetchInternships();
      } catch (err) {
        console.error("Error closing internship:", err);
        alert("Failed to close internship. Please try again.");
      }
    }
  };

  const handleViewApplications = (id) => {
    navigate(`/company/internship/${id}/applications`);
  };

  const handleEdit = (id) => {
    navigate(`/company/edit-internship/${id}`);
  };

  if (loading) {
    return (
      <div className="manage-page">
        <div className="page-header">
          <h2>Manage Internships</h2>
          <p>View and control all your posted internships</p>
        </div>
        <div className="empty">
          <div className="loading-spinner"></div>
          <h3>Loading internships...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-page">

      <div className="page-header">
        <h2>Manage Internships</h2>
        <p>View and control all your posted internships</p>
      </div>

      {internships.length === 0 ? (
        <div className="empty">
          <h3>No internships posted yet</h3>
          <p>Start by creating your first internship!</p>
        </div>
      ) : (
        <div className="internship-grid">
          {internships.map((item) => (
            <div className="internship-card" key={item._id}>

              <div className="card-meta">
                <span className="posted-date">
                  <FiCalendar /> Posted: {new Date(item.createdAt).toLocaleDateString()}
                </span>
                <span className="app-count">
                  <FiUsers /> {item.applicationCount || 0} applications
                </span>
              </div>

              <div className="card-header">
                <h3>{item.title}</h3>
                <span className={`status ${item.status.toLowerCase()}`}>
                  {item.status}
                </span>
              </div>

              <p className="desc">{item.description}</p>

              <div className="details">
                <span><FiMapPin /> {item.location || "Remote"}</span>
                <span><FiClock /> {item.duration || "Flexible"}</span>
                <span><FiDollarSign /> ₹{item.stipend || "Not specified"}</span>
              </div>

              {item.skillsRequired && item.skillsRequired.length > 0 && (
                <div className="skills">
                  {item.skillsRequired.slice(0, 4).map((skill, i) => (
                    <span key={i}>{skill}</span>
                  ))}
                  {item.skillsRequired.length > 4 && (
                    <span>+{item.skillsRequired.length - 4} more</span>
                  )}
                </div>
              )}

              <div className="card-footer">
          
                
                {item.status === "OPEN" && (
                  <>
                    
                    <button
                      className="close-btn"
                      onClick={() => handleClose(item._id)}
                    >
                      Close Internship
                    </button>
                  </>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default ManageInternship;