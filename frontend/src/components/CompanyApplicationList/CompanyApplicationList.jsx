import React, { useEffect, useState } from "react";
import api from "../../api/api";
import "./CompanyApplicationList.css"; // import the CSS we created

const CompanyApplicationList = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all applications for the logged-in company
  const fetchApplications = async () => {
    try {
      const res = await api.get("/applications/company");
      setApplications(res.data);
      console.log("Applications:", res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Update application status
  const updateStatus = async (id, status) => {
    try {
      await api.put(`/applications/${id}/status`, { status });
      fetchApplications(); // refresh list after status update
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <h3 style={{ textAlign: "center", marginTop: 50 }}>Loading...</h3>;

  return (
    <div className="company-application-container">
      <h2>Applicants List</h2>

      {applications.length === 0 && <p>No applications yet.</p>}

      {applications.map((app) => (
        <div key={app._id} className="application-card">
          <h4>{app.user?.name || "Name not available"}</h4>

          <p>
            <b>Email:</b> {app.user?.email || "Email not available"}
          </p>

          <p>
            <b>Skills:</b>{" "}
            {app.student?.skills?.length > 0
              ? app.student.skills.join(", ")
              : "No skills listed"}
          </p>

          <p>
            <b>Internship:</b> {app.internship?.title || "Not available"}
          </p>

          <p>
            <b>Status:</b> {app.status || "Not available"}
          </p>

          <div style={{ marginTop: 12 }}>
            <button onClick={() => updateStatus(app._id, "SELECTED")}>
              Accept
            </button>
            <button onClick={() => updateStatus(app._id, "REJECTED")}>
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CompanyApplicationList;
