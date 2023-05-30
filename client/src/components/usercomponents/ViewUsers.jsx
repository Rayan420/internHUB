import React, { useState, useEffect } from "react";
import axios from "../../services/axios";
import Pagination from "@mui/material/Pagination";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuthHeader } from "react-auth-kit";

const UserTable = () => {
  const authHeader = useAuthHeader();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  console.log(authHeader());
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/users", {
          headers: {
            authorization: authHeader(),
          },
        });
        console.log("users:", response.data);
        const { users } = response.data;
        // CHECK IF USER ISDELETED AND FILTER THEM OUT
        const filteredUsers = users.filter((user) => user.isDeleted === false);
        setUsers(filteredUsers);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        toast.error("Failed to fetch users. Please try again.");
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSelectedUser((prevUser) => {
      let updatedUser = { ...prevUser };
      
      // Handle fields based on the user's role
      if (prevUser.role === "Coordinator") {
        if (name === "department") {
          updatedUser = {
            ...updatedUser,
            coordinator: {
              ...updatedUser.coordinator,
              department: {
                ...updatedUser.coordinator.department,
                name: value,
              },
            },
          };
        } else if (name === "careerCenter") {
          const selectedCareerCenter = users.find(
            (user) => user.id === parseInt(value)
          );
  
          updatedUser = {
            ...updatedUser,
            coordinator: {
              ...updatedUser.coordinator,
              careerCenter: {
                id: selectedCareerCenter.careerCenter.id,
                companyName: selectedCareerCenter.careerCenter.companyName,
              },
            },
          };
        }
      } else if (prevUser.role === "Student") {
        if (name === "department") {
          updatedUser = {
            ...updatedUser,
            student: {
              ...updatedUser.student,
              department: {
                ...updatedUser.student.department,
                name: value,
              },
            },
          };
        } else if (name === "studentNumber") {
          updatedUser = {
            ...updatedUser,
            student: {
              ...updatedUser.student,
              studentNumber: value,
            },
          };
        }
      } else if (prevUser.role === "CareerCenter") {
        if (name === "companyName") {
          updatedUser = {
            ...updatedUser,
            careerCenter: {
              ...updatedUser.careerCenter,
              companyName: value,
            },
          };
        }
        // Add other fields specific to Career Center here if needed
      }
      
      // Update common fields
      updatedUser = {
        ...updatedUser,
        [name]: value,
      };
      
      return updatedUser;
    });
  };
  
  
  
  
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

const handleDeleteUser = async (user) => {
  setIsSaving(true);
  try {
    const response = await axios.delete(`/users/delete/user/${user.id}`, {
      headers: {
        authorization: authHeader(),
      },
    });
    console.log("Response:", response.data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if(response.status === 200){
      setIsSaving(false);
      toast.success(`User ${user.firstName + " " +user.lastName} deleted successfully`);
      //update the users state
      const updatedUsers = users.filter((u) => u.id !== user.id);
      setUsers(updatedUsers);
    }
    if(response.status === 202){
      toast.error(`Failed to delete User ${user.firstName + " " +user.lastName}, ${response.data.message}`);
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    if(response.status === 400){
      toast.error(`User ${user.firstName + " " +user.lastName} could not be deleted`);
    }
  }

}




  const closeModal = () => {
    setIsModalOpen(false);
  };

  const saveChanges = async () => {
    setIsSaving(true);
    try {
      console.log("selectedUser info:", selectedUser);
      const response = await axios.put(`/users/selecteduser/update`, selectedUser, {
        headers: {
          authorization: authHeader(),
        },
      });
      console.log("Response:", response.data);
      
      
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSaving(false);
      if(response.status === 200){
        toast.success(`User ${selectedUser.firstName + " " +selectedUser.lastName} updated successfully`);
      }
      if(response.status === 202){
        toast.error(`Failed to update User ${selectedUser.firstName + " " +selectedUser.lastName}, ${response.data.message}`);
      }
      closeModal();
    } catch (error) {
      console.error("Error updating user:", error);
      if(response.status === 400){
        toast.error(`User ${selectedUser.firstName + " " +selectedUser.lastName} could not be updated`);
      }
    }
    
  };
  

  console.log("selectedUser:", selectedUser);

  // Filter users based on user type and search term
  const filteredUsers = users.filter((user) => {
    if (activeTab === "all") {
      return user.email.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (activeTab === "student") {
      return (
        user.student !== null &&
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else if (activeTab === "coordinator") {
      return (
        user.coordinator !== null &&
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else if (activeTab === "careerCenter") {
      return (
        user.careerCenter !== null &&
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return false;
  });

  // Logic to paginate users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div>
      {/* User table */}
      <div className="coordinator-tab-buttons">
        <button
          className={activeTab === "all" ? "active" : ""}
          onClick={() => setActiveTab("all")}
        >
          All
        </button>
        <button
          className={activeTab === "student" ? "active" : ""}
          onClick={() => setActiveTab("student")}
        >
          Students
        </button>
        <button
          className={activeTab === "coordinator" ? "active" : ""}
          onClick={() => setActiveTab("coordinator")}
        >
          Coordinators
        </button>
        <button
          className={activeTab === "careerCenter" ? "active" : ""}
          onClick={() => setActiveTab("careerCenter")}
        >
          Career Centers
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by email"
        value={searchTerm}
        onChange={handleSearch}
        className="search-input"
      />

      <table className="data-table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Role</th>
            {activeTab === "student" && (
              <>
                <th>Department</th>
                <th>Student Number</th>
              </>
            )}
            {activeTab === "coordinator" && <th>Department</th>}
            {activeTab === "coordinator" && <th>Career Center</th>}
            {activeTab === "careerCenter" && <th>Company Name</th>}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              {activeTab === "student" && (
                <>
                  <td>{user.student.department.name}</td>
                  <td>{user.student.studentNumber}</td>
                </>
              )}
              {activeTab === "coordinator" && (
                <>
                  <td>{user.coordinator.department.name}</td>
                  <td>
                    {user.coordinator.careerCenter
                      ? user.coordinator.careerCenter.companyName || "N/A"
                      : "N/A"}
                  </td>
                </>
              )}
              {activeTab === "careerCenter" && (
                <td>{user.careerCenter.companyName}</td>
              )}
              <td>
                <button
                  className="edit-button"
                  onClick={() => handleEditUser(user)}
                >
                  Edit
                </button>
                {
                  //set circular progress when saving for the button of the selected user
                   isSaving?  <CircularProgress size={20} /> : (
                    <>       
                      <button className="delete-button" onClick={()=>handleDeleteUser(user)}>Delete</button>
                    </>
                    )
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        className="pagination-tab"
        count={Math.ceil(filteredUsers.length / usersPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        variant="outlined"
        shape="rounded"
        color="secondary"
      />


      {/* Edit User Modal */}
                    <Modal className="coordinator-rejection-modal"
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Edit User Modal"
              >
                <h2>Edit User</h2>
                {selectedUser && (
                  <div>
                    {/* Display user fields based on role */}
                    {selectedUser.role === "Coordinator" && (
                      <div>
                        <label>Department:</label>
                        <input
                          type="text"
                          name="department"
                          value={selectedUser.coordinator.department? selectedUser.coordinator.department.name: ""}
                          onChange={handleInputChange}
                        />
                        {/* add a select tag for career centers to change coordinator career center information */}
                        <select
                                name="careerCenter"
                                value={
                                  selectedUser &&
                                  selectedUser.coordinator &&
                                  selectedUser.coordinator.careerCenter &&
                                  selectedUser.coordinator.careerCenter.id
                                    ? selectedUser.coordinator.careerCenter.id
                                    : ""
                                }
                                onChange={handleInputChange}
                              >
                                <option value="">{selectedUser.coordinator.careerCenter? selectedUser.coordinator.careerCenter.companyName: ""}</option>
                                {users.map((user) => {
                                  if (user.role === "Careercenter") {
                                    return (
                                      <option key={user.id} value={user.id}>
                                        {user.careerCenter && user.careerCenter.companyName}
                                      </option>
                                    );
                                  }
                                  return null;
                                })}
                              </select>
                      </div>
                    )}
                    {selectedUser.role === "Student" && (
                      <div>
                        <label>Department:</label>
                        <input
                          type="text"
                          name="department"
                          value={selectedUser.student.department.name}
                          onChange={handleInputChange}
                        />
                        <label>Student Number:</label>
                        <input
                          type="text"
                          name="studentNumber"
                          value={selectedUser.student.studentNumber}
                          onChange={handleInputChange}
                        />
                      </div>
                    )}
                    {selectedUser.role === "CareerCenter" && (
                      <div>
                        <label>Company Name:</label>
                        <input
                          type="text"
                          name="companyName"
                          value={selectedUser.careerCenter.companyName}
                          onChange={handleInputChange}
                        />
                        {/* Add other fields specific to Career Center */}
                      </div>
                    )}
                    {/* Common fields */}
                    <label>Email:</label>
                    <input
                      type="text"
                      name="email"
                      value={selectedUser.email}
                      onChange={handleInputChange}
                    />
                    <label>First Name:</label>
                    <input
                      type="text"
                      name="firstName"
                      value={selectedUser.firstName}
                      onChange={handleInputChange}
                    />
                    <label>Last Name:</label>
                    <input
                      type="text"
                      name="lastName"
                      value={selectedUser.lastName}
                      onChange={handleInputChange}
                    />
                    {/* Save and cancel buttons */}
                    {
                      isSaving?  <CircularProgress size={20} /> : (
                        <>
                            <div className="modal-buttons">
                          <button className="coordinator-rejection-modal-btn-confirm" onClick={saveChanges}>
                            Save
                          </button>
                          <button className="coordinator-rejection-modal-btn" onClick={closeModal}>
                            Cancel
                          </button>
                        </div>
                        </>
                      )
                    }
                    
                  </div>
                )}
              </Modal>

      {/* Loading spinner */}
      {isLoading && <CircularProgress className="loading-spinner" />}
      <ToastContainer />

    </div>
  );
};

export default UserTable;


