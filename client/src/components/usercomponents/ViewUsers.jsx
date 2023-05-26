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
       
        setUsers(users);
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
      if (selectedUser.role === "Coordinator" && name === "careerCenter") {
        return {
          ...prevUser,
          coordinator: {
            ...prevUser.coordinator,
            careerCenter: {
              ...prevUser.coordinator.careerCenter,
              companyName: value,
            },
          },
        };
      } else {
        return {
          ...prevUser,
          [name]: value,
        };
      }
    });
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
                <td>{user.coordinator.careerCenter ? user.coordinator.careerCenter.companyName || "N/A" : "N/A"}</td>
                </>
              )}
              {activeTab === "careerCenter" && (
                <td>{user.careerCenter.companyName}</td>
              )}
              <td>
                <button className="delete-button">Delete</button>
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

      <ToastContainer />
      {/* Loading spinner */}
      {isLoading && <CircularProgress className="loading-spinner" />}
    </div>
  );
};

export default UserTable;
