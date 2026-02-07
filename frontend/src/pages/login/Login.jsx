import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import { loginUser } from "./../../api/api";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginUser(form);

      // Save token + role
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      // Save remember me preference
      if (rememberMe) {
        localStorage.setItem("rememberEmail", form.email);
      }

      // Redirect based on role
      if (res.data.role === "STUDENT") {
        navigate("/student/dashboard");
      } else if (res.data.role === "COMPANY") {
        navigate("/company/dashboard");
      } else {
        navigate("/admin/dashboard");
      }

    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Pre-fill email if remembered
  React.useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberEmail");
    if (rememberedEmail) {
      setForm(prev => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="login-container">
      <div className="login-wrapper">
       

        {/* Right Panel - Login Form */}
        <div className="login-right-panel">
          <div className="login-card">

            <div className="login-header">

              <h2 className="login-title">Welcome Back</h2>
              <p className="login-subtitle">Sign in to your account to continue</p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
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
                    value={form.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="login-input"
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
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="login-input"
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
              </div>

              <div className="form-options">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={loading}
                  />
                  <span className="checkmark"></span>
                  Remember me
                </label>
             
              </div>

              <button
                type="submit"
                className="login-button"
                disabled={loading || !form.email || !form.password}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Signing in...
                  </>
                ) : (
                  "Sign In"
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

     
          

            <div className="register-section">
              <p className="register-text">
                Don't have an account?{" "}
                <button
                  className="register-link"
                  onClick={() => navigate("/register")}
                  disabled={loading}
                >
                  Create account
                </button>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;