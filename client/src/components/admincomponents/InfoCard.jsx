import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';

const InfoCard = ({ title, value, icon, backgroundColor, backgroundColorSecond }) => {
  const backgroundColor1 = backgroundColor;
  const backgroundColor2 = backgroundColorSecond;
  const cardIcon = icon;
  const [navv, setNavv] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (navv) {
      navigate('/users');
    }
  }, [navv, navigate]);

  return (
    <div className="card" style={{ 'backgroundColor': backgroundColor2 }}>
      <div className="circle" style={{ 'backgroundColor': backgroundColor1 }}></div>
      <div className="circle circle2" style={{ 'backgroundColor': backgroundColor2 }}>
        <img className="student-icon" src={cardIcon} alt="student icon" />
      </div>
      <div className="content">
        <div className="card-title">
          <p>{title}</p>
          </div>
        <div className="card-value">
          <h2>{value}</h2>
          </div>
      </div>
      <div className="more-info" onClick={(e) => setNavv(true)} style={{ 'backgroundColor': backgroundColor1, 'cursor': 'pointer' }}>
        <p>More info</p>
      </div>
    </div>
  );
};

export default InfoCard;
