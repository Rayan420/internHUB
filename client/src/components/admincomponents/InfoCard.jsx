// Import the necessary modules
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';

// Define the InfoCard component with props
const InfoCard = ({ title, value, icon, backgroundColor, backgroundColorSecond }) => {
  
  // Declare some variables to be used within the component
  const backgroundColor1 = backgroundColor;
  const backgroundColor2 = backgroundColorSecond;
  const cardIcon = icon;

  // Declare a state variable for navigation
  const [navv, setNavv] = useState(false);

  // Use the useNavigate hook from react-router-dom to navigate to a new route when the navv state changes
  const navigate = useNavigate();
  useEffect(() => {
    if (navv) {
      navigate('/users');
    }
  }, [navv, navigate]);

  // Render the component
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

// Export the InfoCard component as default
export default InfoCard;
