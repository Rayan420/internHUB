import React, { useState } from 'react';
import axios from '../../services/axios';
import { useAuthHeader } from 'react-auth-kit';
const LetterRequestModal = ({ onCloseModal, studentId, coordinatorId }) => {
  const [transcriptFile, setTranscriptFile] = useState(null);
  const [isTranscriptAttached, setIsTranscriptAttached] = useState(false);
  const [isRequestSuccessful, setIsRequestSuccessful] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const authHeader = useAuthHeader();

  const handleTranscriptChange = (event) => {
    const file = event.target.files[0];
    setTranscriptFile(file);
    setIsTranscriptAttached(true);
  };

  const handleSubmit = async () => {
    // Perform the necessary validation
    if (!isTranscriptAttached) {
      setErrorMessage('Transcript is required');
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append('transcriptFile', transcriptFile);
      formData.append('studentId', studentId);
      formData.append('coordinatorId', coordinatorId);
  
      // Send the request to the server
      const response = await axios.post(
        '/letterrequest',
        formData, {
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
          <h2>Request Letter</h2>
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
            <h3>Please upload your most recent transcript</h3>
            <label>
              Transcript:
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleTranscriptChange} />
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

export default LetterRequestModal;