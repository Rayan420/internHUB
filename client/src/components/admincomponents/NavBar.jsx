import React from 'react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../../style/style.css';
import logo from '../../assets/logo.png';
import {useSignOut} from 'react-auth-kit';
import { useNavigate } from "react-router-dom";

const SideNavbar = () => {
  const signOut = useSignOut();
  const navigate = useNavigate();
  const handleLogout = () => {
    signOut();
    navigate('/');
  };

  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };
 
  return (
<div className={`sidebar ${isExpanded ? 'active' : ''}`}>     
 <div className='top'>
        <div className='logo-sidebar'>
          <img className='nav-logo' src={logo} alt="logo" />
          <hr />
          </div>
         <i className="bx bx-menu" id="btn" onClick={toggleSidebar}></i>            
      </div>
      <div className='user'> 
          <div>
            <p className="initials bold"> AR.</p>
            <p className="bold"> Ahmed Rayan</p>
            <p>Admin</p>
          </div>
       </div>
       <ul>
        <li>
            <NavLink className='an' exact="true" to="/dashboard" activeclassname="active">
                <i className="bx bxs-grid-alt"></i>
                <span className="nav-item">Dasboard</span>
            </NavLink>
            <span className='tooltip'>Dashboard</span>
        </li>
        <li>
            <NavLink className='an' exact="true" to="/dashboard/messages" activeclassname="active">
                <i className="bx bxs-envelope"></i>
                <span className="nav-item">Messages</span>
            </NavLink>
            <span className='tooltip'>Messages</span>
        </li>
        <li>
            <NavLink className='an' exact="true" to="/dashboard/users" activeclassname="active">
                <i className="bx bxs-user"></i>
                <span className="nav-item">Users</span>
            </NavLink>
            <span className='tooltip'>Users</span>
        </li>
        <li>
            <NavLink className='an' exact="true" to="/dashboard/settings" activeclassname="active">
                <i className="bx bxs-cog"></i>
                <span className="nav-item">Settings</span>
            </NavLink>
            <span className='tooltip'>Settings</span>
        </li>
        <li>
            <div className='an logout' activeclassname="active" onClick={handleLogout}>
                <i className="bx bxs-log-out" ></i>
                <span className="nav-item">Logout</span>
            </div>
            <span className='tooltip'>Logout</span>
        </li>
       </ul>
    </div>
  );
}


export default SideNavbar;
