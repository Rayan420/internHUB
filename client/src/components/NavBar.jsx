import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import "../style/style.css";
import logo from "../assets/logo.png";
import { useSignOut } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import axios from "../services/axios";
// Define a functional component `SideNavbar` that takes `name`, `role`, `id`, and `links` as props.
const SideNavbar = ({ name, role, id, links }) => {
  // Import the `useSignOut` hook from `react-auth-kit` to handle user sign out.
  const signOut = useSignOut();
  // Import the `useNavigate` hook from `react-router-dom` to navigate to a specific route after user logout.
  const navigate = useNavigate();
  // Define a function `handleLogout` that logs out the current user and navigates to the home page.
  const handleLogout = async () => {
    signOut();
    await axios.post("/logout");
    navigate("/");
  };

  // Define a state variable `isExpanded` to toggle the sidebar on mobile devices.
  const [isExpanded, setIsExpanded] = useState(true);

  // Define a function `toggleSidebar` to toggle the `isExpanded` state variable.
  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  // Extract the first letter of the first and last name to create user initials.
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
    : "";

  // Render the sidebar using JSX.
  return (
    <div className={`sidebar ${isExpanded ? "active" : ""}`}>
      <div className="top">
        <div className="logo-sidebar">
          <img className="nav-logo" src={logo} alt="logo" />
          <hr />
        </div>
        {/* Render a hamburger icon that toggles the sidebar on mobile devices. */}
        <i className="bx bx-menu" id="btn" onClick={toggleSidebar}></i>
      </div>
      {/* Display user information. */}
      <div className="user">
        <div>
          <p className="initials bold">{initials}</p>
          <p className="bold">{name}</p>
          <p id="userID">{id ? `${id}` : ""}</p>
          <p>{role}</p>
        </div>
      </div>
      {/* Render the navigation links. */}
      <ul>
        {links.map((link) => (
          <li key={link.to}>
            <Link className="an" exact="true" to={link.to}>
              <i className={`bx ${link.icon}`}></i>
              <span className="nav-item">{link.label}</span>
            </Link>
            <span className="tooltip">{link.label}</span>
          </li>
        ))}
        {/* Render a logout button that calls the `handleLogout` function when clicked. */}
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

// Export the `SideNavbar` component as the default export of this module.
export default SideNavbar;
