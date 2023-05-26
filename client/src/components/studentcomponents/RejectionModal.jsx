import React from 'react';
import PropTypes from 'prop-types';

const Modal = ({ open, onClose, rejectionReason, url, letterReq }) => {
  const handleCloseModal = () => {
    onClose();
  };
  const DownloadButton = ({ url, label }) => (
    <button
      className='button-cell rejected'
      onClick={() => {
        window.open(url);
        console.log(`Downloading ${label}`);
      }}
    >
      {label}
    </button>
  );

  return (
    open && (
      <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Rejection Reason</h2>
          <button className="modal-close" onClick={handleCloseModal}>
            &times;
          </button>
          
        </div>
        <div className="modal-content">
            <div className='text-container'>
              {rejectionReason}
            </div>
            {letterReq ? (
              <button className='button-cell rejected' onClick={handleCloseModal}
              >
                close
              </button>
            ):(
              <DownloadButton label={"Download Aplication Form"} url={url}/>
            )}
          </div>
      </div>
      
    </div>)
  );
};

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Modal;
