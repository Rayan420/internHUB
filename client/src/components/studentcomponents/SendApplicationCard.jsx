import React, { useState } from 'react';
import '../../style/style.css';
import SendAppModal from "./SendAppModal";

const SendApplicationCard = ({ numButtons, buttonLabels, content, studentId, coordinatorId  }) => {
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
      {modalOpen && <SendAppModal onCloseModal={handleCloseModal} studentId={studentId} coordinatorId={coordinatorId}/>}
    </div>
  );
};

export default SendApplicationCard;
