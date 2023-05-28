import React, { useState } from 'react';
import UploadFileModal from './UploadFileModal';

const UploadInternFiles = ({ numButtons, buttonLabels, content, coordinatorId}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const buttons = [];
  for (let i = 0; i < numButtons; i++) {
    buttons.push(<button key={i} onClick={handleOpenModal}>{buttonLabels[i]}</button>);
  }

  return (
    <div className="request-card">
      <div className="request-card-content">{content}</div>
      <div className="request-card-buttons">{buttons}</div>
      {modalOpen && <UploadFileModal onCloseModal={handleCloseModal} coordinatorId={coordinatorId}/>}

    </div>
  );
};

export default UploadInternFiles;
