import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";

import PageLoader from "../components/shared/PageLoader";

import "./Login.css";

const Login = () => {
  const [flipped, setFlipped] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/auth/login", loginForm);
      login(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/auth/register", registerForm);
      login(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleFlip = () => {
    setError("");
    setFlipped(!flipped);
  };

  return (
    <>
    {loading && <PageLoader />}
    <div className="auth-page">
      <div className={`auth-inner ${flipped ? "flipped" : ""}`}>

        {/* FRONT — Login */}
        <div className="auth-face auth-front">
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Log in to your job tracker</p>

          {!flipped && error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={handleLogin}>
            <div className="auth-field">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={loginForm.email}
                onChange={handleLoginChange}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="auth-field">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={loginForm.password}
                onChange={handleLoginChange}
                placeholder="••••••••"
                required
              />
            </div>
            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account?{" "}
            <span onClick={handleFlip}>Sign up</span>
          </p>
        </div>

        {/* BACK — Register */}
        <div className="auth-face auth-back">
          <h1 className="auth-title">Get started</h1>
          <p className="auth-subtitle">Create your job tracker account</p>

          {flipped && error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={handleRegister}>
            <div className="auth-field">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={registerForm.name}
                onChange={handleRegisterChange}
                placeholder="Raven"
                required
              />
            </div>
            <div className="auth-field">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={registerForm.email}
                onChange={handleRegisterChange}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="auth-field">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={registerForm.password}
                onChange={handleRegisterChange}
                placeholder="••••••••"
                required
              />
            </div>
            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{" "}
            <span onClick={handleFlip}>Log in</span>
          </p>
        </div>

      </div>
    </div>
    </>
  );
};

export default Login;