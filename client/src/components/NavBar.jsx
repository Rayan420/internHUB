import React from "react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../style/style.css";
import logo from "../assets/logo.png";
import { useSignOut } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import axios from "../services/axios";

const SideNavbar = ({ name, role, links }) => {
  const signOut = useSignOut();
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location

  const handleLogout = async () => {
    signOut();
    await axios.post("/logout");
    navigate("/");
  };

  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
    : "";

  return (
    <div className={`sidebar ${isExpanded ? "active" : ""}`}>
      <div className="top">
        <div className="logo-sidebar">
          <img className="nav-logo" src={logo} alt="logo" />
          <hr />
        </div>
        <i className="bx bx-menu" id="btn" onClick={toggleSidebar}></i>
      </div>
      <div className="user">
        <div>
          <p className="initials bold">{initials}</p>
          <p className="bold">{name}</p>
          <p>{role}</p>
        </div>
      </div>
      <ul>
        {links.map((link) => (
          <li key={link.to}>
            <Link
              className={`an ${location.pathname === link.to ? "active" : ""}`} // Check if the current page matches the link
              exact="true"
              to={link.to}
            >
              <i className={`bx ${link.icon}`}></i>
              <span className="nav-item">{link.label}</span>
            </Link>
            <span className="tooltip">{link.label}</span>
          </li>
        ))}
        <li>
          <div className="an logout" onClick={handleLogout}>
            <i className="bx bxs-log-out"></i>
            <span className="nav-item">Logout</span>
          </div>
          <span className="tooltip">Logout</span>
        </li>
      </ul>
    </div>
  );
};

export default SideNavbar;
