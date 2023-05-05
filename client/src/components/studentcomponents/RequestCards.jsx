import React from 'react';
import '../../style/style.css';

const RequestCards = ({ numButtons, buttonLabels, content }) => {
  const buttons = [];
  for (let i = 0; i < numButtons; i++) {
    buttons.push(<button key={i}>{buttonLabels[i]}</button>);
  }

  return (
    <div className="request-card">
      <div className="request-card-content">{content}</div>
      <div className="request-card-buttons">{buttons}</div>
    </div>
  );
};

export default RequestCards;
