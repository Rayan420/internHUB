import React, { useEffect, useState } from 'react';
import axios from '../services/axios';
import { useAuthHeader, useAuthUser } from 'react-auth-kit';
import SideNavbar from '../components/NavBar';
import Header from '../components/Header';
import SignatureComponent from '../components/SignatureComponent';

const SettingsPage = () => {
  const auth = useAuthUser();
  const authHeader = useAuthHeader();
  const [user, setUser] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phoneNum: '',
  });
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingCoordinator, setIsLoadingCoordinator] = useState(true);
  const [isLoadingSignature, setIsLoadingSignature] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [signatureEditMode, setSignatureEditMode] = useState(false);
  const [newFirstName, setNewFirstName] = useState(user.firstName);
  const [newLastName, setNewLastName] = useState(user.lastName);
  const [newPhoneNum, setNewPhoneNum] = useState(user.phoneNum || '');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [coordinator, setCoordinator] = useState({});
  const [signature, setSignature] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);


  let navLinks = [];
  
  if (auth().role === "Student") {
    navLinks = [
      { label: "Dashboard", to: "/dashboard", icon: "bxs-grid-alt" },
      { label: "Messages", to: "/messages", icon: "bxs-envelope" },
      { label: "Internships", to: "/internships", icon: "bxs-user" },
      { label: "Settings", to: "/settings", icon: "bxs-cog" },
    ];
  } else if (auth().role === "Admin") {
    navLinks = [
      { label: "Dashboard", to: "/dashboard", icon: "bxs-grid-alt" },
      { label: "Messages", to: "/messages", icon: "bxs-envelope" },
      { label: "Users", to: "/users", icon: "bxs-user" },
      { label: "Settings", to: "/settings", icon: "bxs-cog" },
    ];
  } else if (auth().role === "Coordinator") {
    navLinks = [
      { label: "Dashboard", to: "/dashboard", icon: "bxs-grid-alt" },
      { label: "Messages", to: "/messages", icon: "bxs-envelope" },
      { label: "Applications", to: "/applications", icon: "bxs-user" },
      { label: "Settings", to: "/settings", icon: "bxs-cog" },
    ];
  }
  else if (auth().role === "Careercenter") {
    navLinks = [
      { label: "Dashboard", to: "/dashboard", icon: "bxs-grid-alt" },
      { label: "Messages", to: "/messages", icon: "bxs-envelope" },
      { label: "Jobs", to: "/jobs", icon: "bxs-user" },
      { label: "Settings", to: "/settings", icon: "bxs-cog" },
    ];
  }
 
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { email } = auth() || {};
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const response = await axios.get('/users/' + email, {
          headers: {
            authorization: authHeader(),
          },
        });
        setUser(response.data);
        setIsLoadingUser(false);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  if(auth().role == 'Coordinator')
  {
    useEffect(() => {
      console.log('Fetching coordinator data');
      const fetchCoordinatorData = async () => {
        try {
          const { email } = auth() || {};
          await new Promise((resolve) => setTimeout(resolve, 2000));
          const { data } = await axios.get('/coordinator/' + email, {
            headers: {
              authorization: authHeader(),
            },
          });
          setCoordinator(data);
          console.log(data);
        } catch (error) {
          console.log(error);
          if (error.response.status === 400 || error.response.status === 500) {
            // Handle error
          }
        } finally {
          setIsLoadingCoordinator(false);
        }
      };
      fetchCoordinatorData();
    }, []);
  }
  

  if(auth().role == 'Coordinator')
  {
    useEffect(() => {
      console.log('Fetching coordinator signature');
      const fetchCoordinatorSignature = async () => {
        try {
          const coordinatorId = coordinator.coordinator.id;
          const response = await axios.get(`/coordinator/signature/${coordinatorId}`, {
            headers: {
              authorization: authHeader(),
            },
          });
  
          setSignature(response.data.signatureURL);
          console.log(response);
        } catch (error) {
          console.log(error);
          if (error.response && (error.response.status === 400 || error.response.status === 500)) {
            // Handle error
          }
        } finally {
          setIsLoadingSignature(false);
        }
      };
      fetchCoordinatorSignature();
    }, [coordinator]);
  }
  

  useEffect(() => {
    if (!isLoadingUser && !isLoadingCoordinator && !isLoadingSignature) {
      setIsSaving(false);
    }
  }, [isLoadingUser, isLoadingCoordinator, isLoadingSignature]);



  const handleEditClick = () => {
    setEditMode(true);
  };
  const handleEditSignatureClick = () => {
    setSignatureEditMode(true);
  };
  const handleCancelSignatureClick = () => {
    setSignatureEditMode(false);
    // Additional logic if needed
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
        firstName: newFirstName !== '' ? newFirstName : user.firstName,
        lastName: newLastName !== '' ? newLastName : user.lastName,
        phoneNum: newPhoneNum !== '' ? newPhoneNum : user.phoneNum,
      };
  
      if (newPassword !== '') {
        updatedUser.password = newPassword;
      }

      // Make an API request to update the user details
      await axios.put(`/users/${user.id}`, updatedUser, {
        headers: {
          authorization: authHeader(),
        },
      });

      // Update the user information in the state
      setUser(updatedUser);
      setEditMode(false);
      setIsSaving(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSaving(false);
      setShowSuccessMessage(true); // Show the success message
      console.log(updatedUser)
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
   console.log("signature",signature)
  if (isSaving) {
    return (
      <div className="settings-loading-spinner">
        <h3>Saving Your information<span className="ellipsis"></span></h3>
        <div className="settings-progress-bar">
          <div className="settings-progress"></div>
        </div>
      </div>
    );
  } 

  if (isLoadingUser) {
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
        links={navLinks}
        name={user.firstName + " " + user.lastName}
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
                value={newFirstName}
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
                value={newLastName}
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
              <label>
                New Password<span className="required-field">*</span>
              </label>
              <div className="settings-password-input-container">
                <input
                  autoComplete="new-password"
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
        {auth().role === 'Coordinator' && (
            <div className="settings-form-container-signature">
            <div className="settings-form-group">
              <label className="settings-signature-label bold">Signature</label>
              {signatureEditMode ? (
                <SignatureComponent
                  initialSignature={signature}
                  edit={signatureEditMode}
                  onCancel={handleCancelSignatureClick}
                  coordinatorId={coordinator.coordinator.id}
                />
              ) : (
                <div className="existing-signature">
                  <img src={signature} alt="Existing Signature" />
                  <button className="settings-edit-signature-button" onClick={handleEditSignatureClick}>
                    Edit Signature
                  </button>
                </div>
              )}
            </div>
          </div>
          
          )}
      </div>
      <div className={`settings-overlay ${showSuccessMessage ? 'show' : ''}`} />
      {showSuccessMessage && (
        <div className="success-message">
          <p className='bold' >Your account information has been successfully updated!</p>
          <button className="settings-btn btn-primary" onClick={() => setShowSuccessMessage(false)}>
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
