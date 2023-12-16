import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdEmail } from "react-icons/md";

import "./Profile.css";
import profileImage from "./profile.png";

const Profile = () => {
  const token = localStorage.getItem("token");
  const [profileData, setProfileData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false); // State for the modal
  const [password, setPassword] = useState(""); // State for the entered password
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Fetch user profile data from the server when the component mounts
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/Admin/profile`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include your authentication token here
        },
      }) // Update this endpoint to the appropriate route
      .then((response) => {
        setProfileData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching profile data:", error);
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
    // Perform password check and make the API call here
    axios
      .delete(`${process.env.REACT_APP_API_URL}/api/admin/delete`, {
        data: { password: password },
        headers: {
          Authorization: `Bearer ${token}`, // Include your authentication token here
        }, // Include email and password
      })
      .then((response) => {
        localStorage.clear();
        window.location.href = "/";
        // Handle success
        console.log("Shop closed successfully");
        // Close the modal
        handleCloseModal();
      })
      .catch((error) => {
        // Handle errors, e.g., incorrect password
        console.error("Error closing shop:", error);
        setErrorMessage("Incorrect password. Please try again.");
        // Optionally, you can display an error message to the user
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
        <div className="sells-details">
          <div className="grid-container">
            <div className="sells-card">
              <h3>Net Stock</h3>
              <p className="sells">{profileData.netStock}</p>
            </div>
            <div className="sells-card">
              <h3>Net Sales</h3>
              <p className="sells">{profileData.netSales}</p>
            </div>
            <div className="sells-card">
              <h3>Net Profit</h3>
              <p className="sells">{profileData.profit}</p>
            </div>
            <div className="sells-card">
              <h3>Total Employees</h3>
              <p className="sells">{profileData.totalEmployees}</p>
            </div>
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
