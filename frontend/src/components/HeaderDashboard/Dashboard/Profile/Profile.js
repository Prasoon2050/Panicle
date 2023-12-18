import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdEmail, MdPeople, MdAccountCircle } from "react-icons/md";

import Chart from "chart.js/auto";

import "./Profile.css";
import profileImage from "./profile.png";

const Profile = () => {
  const token = localStorage.getItem("token");
  const [profileData, setProfileData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [ageDistribution, setAgeDistribution] = useState([]);
  const [departmentCount, setDepartmentCount] = useState([]);

  useEffect(() => {
    // Fetch user profile data from the server when the component mounts
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/Admin/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setProfileData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching profile data:", error);
      });

    // Fetch additional data for charts
    // Fetch additional data for charts
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/api/admin/employees/age-distribution`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setAgeDistribution(response.data);

        const ageDistributionChartCanvas = document.getElementById(
          "ageDistributionChart"
        );
        new Chart(ageDistributionChartCanvas, {
          type: "bar",
          data: {
            labels: response.data.map((item) => item._id),
            datasets: [
              {
                label: "Employee Count",
                data: response.data.map((item) => item.count),
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Age Range",
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Number of Employees",
                },
              },
            },
          },
        });
      })
      .catch((error) => {
        console.error("Error fetching age distribution:", error);
      });

    // Fetch department count data
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/api/admin/employees/department-count`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setDepartmentCount(response.data);

        // Chart.js - Department Count Chart
        const departmentCountChartCanvas = document.getElementById(
          "departmentCountChart"
        );
        new Chart(departmentCountChartCanvas, {
          type: "pie",
          data: {
            labels: response.data.map((item) => item._id),
            datasets: [
              {
                data: response.data.map((item) => item.count),
                backgroundColor: [
                  "rgba(255, 99, 132, 0.2)",
                  "rgba(54, 162, 235, 0.2)",
                  "rgba(255, 206, 86, 0.2)",
                  // Add more colors as needed
                ],
                borderColor: [
                  "rgba(255, 99, 132, 1)",
                  "rgba(54, 162, 235, 1)",
                  "rgba(255, 206, 86, 1)",
                  // Add more colors as needed
                ],
                borderWidth: 1,
              },
            ],
          },
        });
      })
      .catch((error) => {
        console.error("Error fetching department count:", error);
      });
  }, [token]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmCloseShop = () => {
    axios
      .delete(`${process.env.REACT_APP_API_URL}/api/admin/delete`, {
        data: { password: password },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        localStorage.clear();
        window.location.href = "/";
        handleCloseModal();
      })
      .catch((error) => {
        console.error("Error closing shop:", error);
        setErrorMessage("Incorrect password. Please try again.");
      });
  };

  return (
    <div className="component-container">
      <h1 className="profile-component-heading">Profile</h1>
      <div className="top-section">
        <div className="profile-section">
          <div className="profile-photo-container">
            <img src={profileImage} alt="Profile" className="profile-photo" />
          </div>
          <p className="profileData-username">
            <span className="username-icon">
              <MdAccountCircle />
            </span>
            <p className="headings">Username : </p>
            {profileData.username}
          </p>
          <p className="profileData-email">
            <span className="mail-icon">
              <MdEmail />
            </span>
            <p className="headings">Email : </p>
            {profileData.email}
          </p>
          <p className="profileData-totalEmployees">
            <span className="totalEmployees-icon">
              <MdPeople />
            </span>
            <p className="headings">Employee Count : </p>
            {profileData.totalEmployees}
          </p>
        </div>

        <div className="charts">
          <div className="chart">
            <h3 className="chart-heading">Age Distribution</h3>
            {ageDistribution.length > 0 ? (
              <canvas id="ageDistributionChart"></canvas>
            ) : (
              <p>No data found for Age Distribution</p>
            )}
          </div>
          <div className="chart">
            <h3 className="chart-heading">Department Employee Count</h3>
            {departmentCount.length > 0 ? (
              <canvas id="departmentCountChart"></canvas>
            ) : (
              <p>No data found for Department Employee Count</p>
            )}
          </div>
        </div>
      </div>

      <div className="close-shop" onClick={handleOpenModal}>
        Close Admin
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <span className="close" onClick={handleCloseModal}>
              &times;
            </span>
            <h2 className="shopclosure">Confirm Admin Closure</h2>
            <p className="shopclosure">
              Enter your password to close the Admin:
            </p>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <input
              type="password"
              placeholder="Password"
              className="password1"
              value={password}
              onChange={handlePasswordChange}
            />
            <button onClick={handleConfirmCloseShop}>Confirm</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
