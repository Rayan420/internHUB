import React, { useEffect, useState } from 'react';
import axios from '../services/axios';
import { useAuthHeader, useAuthUser } from 'react-auth-kit';
import SideNavbar from '../components/NavBar';
import Header from '../components/Header';

const SettingsPage = () => {
  const auth = useAuthUser();
  const authHeader = useAuthHeader();
  const [user, setUser] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phoneNum: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newPhoneNum, setNewPhoneNum] = useState(user.phoneNum || '');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { email } = auth() || {};
        // Make an API request to fetch the user details
        await new Promise(resolve => setTimeout(resolve, 2000));
        const response = await axios.get('/users/' + email, {
          headers: {
            authorization: authHeader(),
          },
        });

        // Set the user information in the state
        setUser(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancelClick = () => {
    setEditMode(false);
    // Reset the input fields to the original values
    setNewFirstName(user.firstName);
    setNewLastName(user.lastName);
    setNewPhoneNum(user.phoneNum || '');
    setNewPassword('');
  };
  useEffect(() => {
    document.title = "InternHUB - Settings";
    
  }, []);
 

  const handleSaveClick = async () => {
    try {
      const updatedUser = {
        ...user,
        firstName: newFirstName,
        lastName: newLastName,
        phoneNum: newPhoneNum,
      };

      // Make an API request to update the user details
      await axios.put(`/users/${user.id}`, updatedUser, {
        headers: {
          authorization: authHeader(),
        },
      });

      // Update the user information in the state
      setUser(updatedUser);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  /*
  if (isLoading) {
    return (
      <div className="settings-loading-spinner">
        <h3>Saving Your information<span className="ellipsis"></span></h3>
        <div className="settings-progress-bar">
          <div className="settings-progress"></div>
        </div>
      </div>
    );
  } */

  if (isLoading) {
    return (
      <div className="loading-spinner">
      <h3>Loading Your Information <span className="ellipsis"></span></h3>
        <div className="progress-bar">
          <div className="progress"></div>
        </div>
      </div>
    );
  }
  return (
    <div className="settings-container">
      {/* NAVBAR */}
      <SideNavbar
        links={[
          { label: 'Dashboard', to: '/dashboard', icon: 'bxs-grid-alt' },
          { label: 'Messages', to: '/messages', icon: 'bxs-envelope' },
          { label: 'Internships', to: '/internships', icon: 'bxs-user' },
          { label: 'Settings', to: '/settings', icon: 'bxs-cog' },
        ]}
        name={user.firstName + ' ' + user.lastName}
        role={auth().role}
      />
      <div className="main-content main-dashboard">
        {/* this is the div containing the main content of the page */}
        {/* header */}
        <Header title="Settings" />
        <div className="settings-form-container">
          <div className="settings-form-group">
            <label>Email</label>
            <input type="text" value={user.email} readOnly disabled />
          </div>
          {editMode ? (
            <div className="settings-form-group">
              <label>First Name</label>
              <input
                type="text"
                value={user.firstName}
                onChange={(e) => setNewFirstName(e.target.value)}
              />
            </div>
          ) : (
            <div className="settings-form-group">
              <label>First Name</label>
              <p>{user.firstName}</p>
            </div>
          )}
          {editMode ? (
            <div className="settings-form-group">
              <label>Last Name</label>
              <input
                type="text"
                value={user.lastName}
                onChange={(e) => setNewLastName(e.target.value)}
              />
            </div>
          ) : (
            <div className="settings-form-group">
              <label>Last Name</label>
              <p>{user.lastName}</p>
            </div>
          )}
          {editMode ? (
            <div className="settings-form-group">
              <label>Phone Number</label>
              <input
                type="text"
                value={newPhoneNum === user.email ? "" : newPhoneNum}
                onChange={(e) => setNewPhoneNum(e.target.value)}
                autoComplete="false"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck="false"
              />
            </div>
          ) : (
            <div className="settings-form-group">
              <label>Phone Number</label>
              <p>{user.phoneNum }</p>
            </div>
          )}
          {editMode && (
            <div className="settings-form-group">
              <label>New Password</label>
              <div className="settings-password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <span
                  className={`settings-password-icon ${showPassword ? 'active' : ''}`}
                  onClick={togglePasswordVisibility}
                >
                  Show
                </span>
              </div>
            </div>
          )}
          {!editMode && (
            <div className="settings-form-group">
              <label>Role</label>
              <p>{auth().role}</p>
            </div>
          )}
          {editMode ? (
            <div className="settings-button-group">
              <button className="settings-cancel-button" onClick={handleCancelClick}>
                Cancel
              </button>
              <button className="settings-save-button" onClick={handleSaveClick}>
                Save
              </button>
            </div>
          ) : (
            <button className="settings-edit-button" onClick={handleEditClick}>
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
