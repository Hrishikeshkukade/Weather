import React from "react";

const ErrorModal = ({ errorMessage }) => {
  return (
    <div className="error-modal">
      <div className="error-modal-content">
        <h2>Error</h2>
        <p>{errorMessage}</p>
      </div>
    </div>
  );
};

export default ErrorModal;

