import React from "react";
import './SaveConfirmation.css';

const SaveConfirmation = ({ onSaveConfirmed, onCancel }) => {
  return (
    <div className="save-confirmation-container">
      <div className="save-confirmation-modal">
        <h3>Confirm Deletion</h3>
        <p>Are you sure you want to save the changes?</p>
        <div className="save-buttons">
          <button onClick={onSaveConfirmed} className="save-confirm-button">
            Confirm
          </button>
          <button onClick={onCancel} className="save-cancel-button">
            Cancel
          </button>
        </div>
      </div>
    </div>
    
  );
};

export default SaveConfirmation;