import React from "react";
import "./DeleteConfirmation.css";

const DeleteConfirmation = ({ onDelete, onCancel }) => {
  return (
    <div className="delete-confirmation-container">
      <div className="delete-confirmation-modal">
        <h3>Confirm Deletion</h3>
        <p>Are you sure you want to fire this Employee?</p>
        <div className="delete-buttons">
          <button onClick={onDelete} className="delete-confirm-button">
            Confirm
          </button>
          <button onClick={onCancel} className="delete-cancel-button">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
