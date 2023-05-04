import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../style/style.css';
import logo from '../../assets/logo.png';
import {useSignOut} from 'react-auth-kit';
import { useNavigate } from "react-router-dom";

const SideNavbar = ({history}) => {
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
            <Link className='an' exact="true" to="/dashboard" >
                <i className="bx bxs-grid-alt"></i>
                <span className="nav-item">Dasboard</span>
            </Link>
            <span className='tooltip'>Dashboard</span>
        </li>
        <li>
            <Link className='an' exact="true" to="/dashboard/messages" >
                <i className="bx bxs-envelope"></i>
                <span className="nav-item">Messages</span>
            </Link>
            <span className='tooltip'>Messages</span>
        </li>
        <li>
            <Link className='an'  to="/users" >
                <i className="bx bxs-user"></i>
                <span className="nav-item">Users</span>
            </Link>
            
            <span className='tooltip'>Users</span>
        </li>
        <li>
            <Link className='an' exact="true" to="/dashboard/settings" >
                <i className="bx bxs-cog"></i>
                <span className="nav-item">Settings</span>
            </Link>
            <span className='tooltip'>Settings</span>
        </li>
        <li>
            <div className='an logout' onClick={handleLogout}>
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
