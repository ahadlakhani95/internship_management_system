// components/ApplicationForm/ApplicationForm.jsx
import React, { useState } from "react";
import api from "../../api/api";
import { useNavigate, useParams } from "react-router-dom";
import "./applicationform.css";

const ApplicationForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [resumeFile, setResumeFile] = useState(null);
    const [resumeURL, setResumeURL] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleFileChange = (e) => {
        setResumeFile(e.target.files[0]);
        setResumeURL(""); // Clear URL if file is selected
    };

    const handleUrlChange = (e) => {
        setResumeURL(e.target.value);
        setResumeFile(null); // Clear file if URL is entered
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!resumeFile && !resumeURL) {
            return setError("Please upload a PDF or provide a resume URL.");
        }

        setLoading(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append("internshipId", id);

            if (resumeFile) {
                formData.append("resume", resumeFile);
            } else {
                formData.append("resume", resumeURL);
            }

            await api.post("/applications/apply", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            alert("Application submitted successfully!");
            navigate("/student/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="apply-container">
            <div className="form-card">
                <div className="form-header">
                    <h1 className="form-title">Apply for Internship</h1>
                    <p className="form-subtitle">Submit your resume to apply</p>
                </div>

                <form onSubmit={handleSubmit} className="application-form">
                    <div className="form-section">
                        <h3>Upload Resume</h3>
                        <p className="section-description">Choose one option below</p>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Upload PDF File</label>
                        <div className="file-input-wrapper">
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                className="file-input"
                                id="resume-file"
                            />
                            <label htmlFor="resume-file" className="file-label">
                                {resumeFile ? resumeFile.name : "Choose file"}
                            </label>
                        </div>
                        {resumeFile && (
                            <div className="file-info">
                                <span className="file-name">{resumeFile.name}</span>
                                <span className="file-size">
                                    {(resumeFile.size / 1024).toFixed(1)} KB
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="divider">
                        <span>OR</span>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Resume URL</label>
                        <input
                            type="url"
                            value={resumeURL}
                            onChange={handleUrlChange}
                            placeholder="https://drive.google.com/your-resume.pdf"
                            className="url-input"
                        />
                        <p className="input-hint">Provide a direct link to your resume PDF</p>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="btn-secondary"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading || (!resumeFile && !resumeURL)}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Submitting...
                                </>
                            ) : (
                                "Submit Application"
                            )}
                        </button>
                    </div>

                    {error && (
                        <div className="error-message">
                            <span className="error-icon">!</span>
                            {error}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ApplicationForm;