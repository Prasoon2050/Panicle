import React, { useState } from "react";
import "./LandingPage.css";
import { Link } from "react-router-dom";
import axios from "axios";

function LandingPage() {
  const [activeTab, setActiveTab] = useState("loginAdmin");
  const [loginError, setLoginError] = useState(null);

  const [loading, setLoading] = useState(false);
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      let response;
      if (activeTab === "loginAdmin") {
        response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/login`,
          {
            email,
            password,
            role: "Admin",
          }
        );
      } else if (activeTab === "loginUser") {
        response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/login`,
          {
            email,
            password,
            role: "employee",
          }
        );
      }

      if (response && response.status === 200) {
        const { token } = response.data;

        // Store the token in local storage
        localStorage.setItem("token", token);

        // Redirect to dashboard based on role
        if (activeTab === "loginAdmin") {
          window.location.href = "/dashboard"; // Replace with your actual admin dashboard route
        } else if (activeTab === "loginUser") {
          window.location.href = "/dashboard"; // Replace with your actual employee dashboard route
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("**Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="landing-container">
      <div className="landing-firsthalf">
        <h1 className="heading"> Login to Your Account</h1>
        <div className="landing-tabs">
          <div className="landing-tab-label">Admin</div>
          <label
            className={`landing-switch ${
              activeTab === "loginUser" ? "user" : "admin"
            }`}
          >
            <input
              type="checkbox"
              onChange={() =>
                handleTabChange(
                  activeTab === "loginAdmin" ? "loginUser" : "loginAdmin"
                )
              }
            />
            <span className="landing-slider"></span>
          </label>
          <div className="landing-tab-label">User</div>
        </div>
        <div className="landing-login-form">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              await handleLogin(e);
              setLoading(false);
            }}
          >
            <label className="landing-name-field">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              className="login-input-field"
              required
            />
            <br />
            <label className="landing-name-field">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              className="login-input-field"
              required
            />
            <br />
            {loginError && <p className="landing-error">{loginError}</p>}
            <button type="submit" className="landing-login-button">
              {loading ? "Signing you." : "Login!"}
            </button>
          </form>
        </div>
      </div>
      <div className="landing-secondhalf">
        <h1 className="heading">New Here?</h1>
        <p className="sign-details">
          Sign Up and discover a great
          <br />
          amount of new Opportunities!
        </p>
        <div className="landing-button-container">
          <Link to="/register">
            <button className={`landing-create-account-button `}>
              Create Account
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
