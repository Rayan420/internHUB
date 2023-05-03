import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import '../../style/style.css';

const SideNavbar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  }

  

  return (
    <div className="side-navbar">
      <div className="toggle-button" onClick={handleToggle}>
        <FontAwesomeIcon icon={faBars} />
      </div>
      <ul className={`navbar-nav ${isExpanded ? 'expanded' : ''}`}>
        <li className="nav-item">
          <NavLink exact="true" to="/dashboard" activeclassname="active">
            Home
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink exact="true" to="/dashboard/profile" activeclassname="active">
            Profile
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink exact="true" to="/dashboard/settings" activeclassname="active">
            Settings
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default SideNavbar;
