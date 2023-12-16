import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdEmail } from "react-icons/md";
import { Boxplot } from "react-chartjs-2";

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
  const [salaryDistribution, setSalaryDistribution] = useState([]);

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
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching profile data:", error);
      });

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

        // Chart.js - Age Distribution Chart
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

    // Fetch salary distribution data

    axios
      .get(
        `${process.env.REACT_APP_API_URL}/api/admin/employees/salary-distribution`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setSalaryDistribution(response.data);

        // Chart.js - Average Salary Distribution Chart
        const salaryDistributionChartCanvas = document.getElementById(
          "salaryDistributionChart"
        );
        new Chart(salaryDistributionChartCanvas, {
          type: "bar", // You can choose a different chart type based on your preference
          data: {
            labels: response.data.map((item) => item._id),
            datasets: [
              {
                label: "Average Salary",
                data: response.data.map((item) =>
                  item.averageSalary.toFixed(2)
                ),
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1,
              },
            ],
          },
        });
      })
      .catch((error) => {
        console.error("Error fetching salary distribution:", error);
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
        {/* ... (your existing code) */}
        <div className="profile-section">
          <div className="profile-photo-container">
            <img src={profileImage} alt="Profile" className="profile-photo" />
          </div>
          <p className="profileData-username">{profileData.username}</p>
          <p className="profileData-email">
            <span className="mail-icon">
              <MdEmail />
            </span>
            {profileData.email}
          </p>
          <p className="profileData-shopName">
            Shop Name: {profileData.shopName}
          </p>
        </div>

        {/* Charts */}
        <div className="charts">
          <div className="chart">
            <h3>Age Distribution Chart</h3>
            <canvas id="ageDistributionChart" width="400" height="200"></canvas>
          </div>
          <div className="chart">
            <h3>Department Employee Count Chart</h3>
            <canvas id="departmentCountChart" width="400" height="200"></canvas>
          </div>
          <div className="chart">
            <h3>Salary Range Distribution Chart</h3>
            <canvas
              id="salaryDistributionChart"
              width="400"
              height="200"
            ></canvas>
          </div>
        </div>
      </div>

      <div className="close-shop" onClick={handleOpenModal}>
        Close Shop
      </div>

      {/* Modal for entering password */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <span className="close" onClick={handleCloseModal}>
              &times;
            </span>
            <h2 className="shopclosure">Confirm Shop Closure</h2>
            <p className="shopclosure">
              Enter your password to close the shop:
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
