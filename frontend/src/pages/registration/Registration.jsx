import React, { useState } from "react";
import "./registration.css";
import { registerUser } from "./../../api/api";
import { useNavigate } from "react-router-dom";

const Registration = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (formData.password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    if (formData.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    if (!termsAccepted) {
      return setError("Please accept the terms and conditions");
    }

    setLoading(true);
    setError("");

    try {
      const res = await registerUser(formData);

      localStorage.setItem("token", res.data.token);

      alert("Registration Successful! You can now login.");

      navigate("/login");

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <div className="brand-header">
            
            <h1 className="brand-title">
              Intership Management System
            </h1>
          </div>

          <h2 className="register-title">Create Account</h2>
          <p className="register-subtitle">Join InternTrack and start your journey</p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Full Name</label>
            <div className="input-with-icon">
              <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#667eea" strokeWidth="2" />
                <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#667eea" strokeWidth="2" />
              </svg>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                required
                onChange={handleChange}
                disabled={loading}
                value={formData.name}
                className="register-input"
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Email Address</label>
            <div className="input-with-icon">
              <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="#667eea" strokeWidth="2" />
                <path d="M22 6L12 13L2 6" stroke="#667eea" strokeWidth="2" />
              </svg>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                required
                onChange={handleChange}
                disabled={loading}
                value={formData.email}
                className="register-input"
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div className="input-with-icon">
              <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="#667eea" strokeWidth="2" />
                <path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" stroke="#667eea" strokeWidth="2" />
              </svg>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="At least 6 characters"
                required
                onChange={handleChange}
                disabled={loading}
                value={formData.password}
                className="register-input"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                disabled={loading}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#718096" strokeWidth="2" />
                    <circle cx="12" cy="12" r="3" stroke="#718096" strokeWidth="2" />
                    <line x1="1" y1="1" x2="23" y2="23" stroke="#718096" strokeWidth="2" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#718096" strokeWidth="2" />
                    <circle cx="12" cy="12" r="3" stroke="#718096" strokeWidth="2" />
                  </svg>
                )}
              </button>
            </div>
            {formData.password && formData.password.length < 6 && (
              <p className="input-hint error">Password must be at least 6 characters</p>
            )}
          </div>

          <div className="input-group">
            <label className="input-label">Confirm Password</label>
            <div className="input-with-icon">
              <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="#667eea" strokeWidth="2" strokeLinecap="round" />
                <path d="M22 4L12 14.01L9 11.01" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm your password"
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                value={confirmPassword}
                className="register-input"
              />
            </div>
            {confirmPassword && formData.password !== confirmPassword && (
              <p className="input-hint error">Passwords do not match</p>
            )}
          </div>

          <div className="input-group">
            <label className="input-label">Account Type</label>
            <div className="role-selector">
              {["STUDENT", "COMPANY", "ADMIN"].map((role) => (
                <label key={role} className={`role-option ${formData.role === role ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    checked={formData.role === role}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <span className="role-label">
                    {role === "STUDENT" ? "Student" :
                      role === "COMPANY" ? "Company" : "Admin"}
                  </span>
                </label>
              ))}
            </div>
            <div className="role-descriptions">
              <p className={`role-hint ${formData.role === "STUDENT" ? 'active' : ''}`}>
                • Search and apply for internships
              </p>
              <p className={`role-hint ${formData.role === "COMPANY" ? 'active' : ''}`}>
                • Post internship opportunities
              </p>
              <p className={`role-hint ${formData.role === "ADMIN" ? 'active' : ''}`}>
                • Manage platform users and content
              </p>
            </div>
          </div>

          <div className="terms-group">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                disabled={loading}
              />
              <span className="checkmark"></span>
              <span className="terms-text">
                I agree to the <a href="/terms" className="terms-link">Terms of Service</a> and <a href="/privacy" className="terms-link">Privacy Policy</a>
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="register-button"
            disabled={loading || !termsAccepted}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>

          {error && (
            <div className="error-message">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#fed7d7" />
                <path d="M12 8V12M12 16H12.01" stroke="#c53030" strokeWidth="2" strokeLinecap="round" />
              </svg>
              {error}
            </div>
          )}
        </form>

        <div className="login-section">
          <p className="login-text">
            Already have an account?{" "}
            <button
              className="login-link"
              onClick={() => navigate("/login")}
              disabled={loading}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registration;