import React, { useState } from 'react';
import axios from '../../services/axios';
import { useAuthHeader } from 'react-auth-kit';

const UploadFileModal = ({ onCloseModal, studentId, coordinatorId }) => {
  const [reportFile, setReportFile] = useState(null);
  const [applicationFile, setApplicationFile] = useState(null);
  const [isReportAttached, setIsReportAttached] = useState(false);
  const [isApplicationAttached, setIsApplicationAttached] = useState(false);
  const [isRequestSuccessful, setIsRequestSuccessful] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const authHeader = useAuthHeader();

  const handleReportChange = (event) => {
    const file = event.target.files[0];
    setReportFile(file);
    setIsReportAttached(true);
  };

  const handleApplicationChange = (event) => {
    const file = event.target.files[0];
    setApplicationFile(file);
    setIsApplicationAttached(true);
  };

  const handleSubmit = async () => {
    // Perform the necessary validation
    if (!isReportAttached || !isApplicationAttached) {
      setErrorMessage('Report and application form are required');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('reportFile', reportFile);
      formData.append('applicationFile', applicationFile);
      formData.append('coordinatorId', coordinatorId);

      // Send the request to the server
      const response = await axios.put(`/forms/upload/files/${coordinatorId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: authHeader(),
        },
      });

      // Handle the response
      setIsRequestSuccessful(true);
      setSuccessMessage(response.data.message);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('An error occurred while processing your request.');
      }
      console.error('Error:', error);
    }
  };

  const handleCloseModal = () => {
    onCloseModal();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Send Internship Application</h2>
          <button className="modal-close" onClick={handleCloseModal}>
            &times;
          </button>
        </div>
        {isRequestSuccessful ? (
          <div className="modal-content">
            <p>{successMessage}</p>
          </div>
        ) : (
          <div className="modal-content">
            <h3>Please upload the following files:</h3>
            <label>
              Application Form:
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleApplicationChange} />
            </label>
            <label>
              Report:
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleReportChange} />
            </label>
            <button className="btn-compose btn-primary" onClick={handleSubmit}>
              Send Letter Request
            </button>
            {errorMessage && <p className="errmsg shake">{errorMessage}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadFileModal;
