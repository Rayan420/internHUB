import React, { useState, useEffect } from "react";
import axios from "../../services/axios";
import { useAuthHeader } from "react-auth-kit";
import Pagination from "@mui/material/Pagination";
import Modal from "react-modal";
import CircularProgress from "@mui/material/CircularProgress";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Set the app element
Modal.setAppElement("#root");

const SGKRequests = ({ careerCenterId }) => {
  const authHeader = useAuthHeader();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [activeTab, setActiveTab] = useState("In Progress");
  const [currentPage, setCurrentPage] = useState(1);
  const [requestsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [approvingRequest, setApprovingRequest] = useState(false);
  const [statusChange, setStatusChange] = useState(null);
  const [sgkFile, setSGKFile] = useState(null);
  const [isSGKAttached, setIsSGKAttached] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleSGKChange = (event) => {
    const file = event.target.files[0];
    setSGKFile(file);
    setIsSGKAttached(true);
    setErrorMessage("");
  }

  useEffect(() => {
    const fetchLetterRequests = async () => {
      try {
        const response = await axios.get(`/careercenter/requests/${careerCenterId.id}/applications`, {
          headers: {
            authorization: authHeader(),
          },
        });
        const { applications } = response.data;
        setRequests(applications);
      } catch (error) {
        console.error("Error fetching letter requests:", error);
      }
    };

    fetchLetterRequests();
  }, [careerCenterId, statusChange]);

  useEffect(() => {
    if (requests) {
      setFilteredRequests(requests.filter((request) => request.status === activeTab));
      setCurrentPage(1); // Reset current page when tab changes
    }
  }, [requests, activeTab]);

  const handleSearch = () => {
    const filtered = requests.filter((request) => request.id.toString().includes(searchId));
    setFilteredRequests(filtered);
    setCurrentPage(1); // Reset current page when search is performed
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchId(""); // Reset search ID when tab changes
  };

  const handleApproveRequest = async (requestId, firstName, lastName) => {
    try {
      setApprovingRequest(true); // Start spinner
      const formData = new FormData();
      formData.append('sgkFile', sgkFile);
      const res = await axios.put(`/careercenter/response/${requestId}/sgk`, formData, {
        headers: {
          authorization: authHeader(),
        },
      });
  
      if (res.status === 202) {
        return setErrorMessage(res.data.message);
      }
  
      setStatusChange({ requestId, status: "In Progress" });
      setApprovingRequest(false); // Stop spinner
      toast.success(
        <span>
          {firstName + " " + lastName}'s SGK has been <span className="bold approved">sent</span> successfully!
        </span>
      );
      
      // Update the requests state to reflect the status change
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === requestId ? { ...request, status: 'Approved' } : request
        )
      );
      setApprovingRequest(false); // Stop spinner
        closeModal();
    } catch (error) {
      if (error.status === 404 || error.status === 400) {
        toast.error(error.data.message);
        setApprovingRequest(false); // Stop spinner
        return;
      }
    }
  };
  

  const handleDeleteRequest = async (requestId) => {
    try {
      await axios.delete(`/careercenter/sgk/${careerCenterId.id}/delete/${requestId}`, {
        headers: {
          authorization: authHeader(),
        },
      });
      toast.success(`Request ${requestId} has been deleted successfully!`);
      setRequests((prevRequests) => prevRequests.filter((request) => request.id !== requestId));
      // set that status change to trigger a re-render
      setStatusChange({ requestId, status: "In Progress" });
    } catch (error) {
      console.error("Error deleting request:", error);
    }
  };

  const handleSendSGK = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const closeModal = () => {
    setErrorMessage("");
    setSelectedRequest(null);
    setShowModal(false);
  };

  // Get current requests based on pagination
  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const renderCompletedRequest = (request) => {
    return (
      <tr key={request.id}>
        <td>{request.id}</td>
        <td>{request.student.user.firstName}</td>
        <td>{request.student.user.lastName}</td>
        <td>{request.student.user.email}</td>

        <td>{request.applicationDate ? request.applicationDate.split("T")[0] : ""}</td>
        <td>
          <button className="button-delete" onClick={() => handleDeleteRequest(request.id)}>
            Delete
          </button>
        </td>
      </tr>
    );
  };
  console.log("requests",requests);
  const renderInProgressRequest = (request) => {
    return (
      <tr key={request.id}>
        <td>{request.id}</td>
        <td>{request.student.user.firstName}</td>
        <td>{request.student.user.lastName}</td>
        <td>{request.student.user.email}</td>
        <td>{request.applicationDate ? request.applicationDate.split("T")[0] : ""}</td>
        <td>
          <button className="button-approve" onClick={() => handleSendSGK(request)}>
            Send SGK
          </button>
        </td>
      </tr>
    );
  };

  return (
    <div className="coordinator-container">
      <h2>SGK Requests</h2>
      <div className="coordinator-search-bar">
        <label>Search by ID:</label>
        <input type="text" value={searchId} onChange={(e) => setSearchId(e.target.value)} />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className="coordinator-tab-buttons">
        <button className={activeTab === "In Progress" ? "active" : ""} onClick={() => handleTabChange("In Progress")}>
          In progress
        </button>
        <button className={activeTab === "Completed" ? "active" : ""} onClick={() => handleTabChange("Completed")}>
          Completed
        </button>
      </div>

      <table className="coordinator-table">
        <thead>
          <tr>
            <th>Application Number</th>
            <th>First Name</th>
            <th>Surname</th>
            <th>Email</th>
            <th>Request Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.length > 0 ? (
            currentRequests.map((request) => {
              if (activeTab === "In Progress") {
                return renderInProgressRequest(request);
              } else if (activeTab === "Completed") {
                return renderCompletedRequest(request);
              }
              return null;
            })
          ) : (
            <tr>
              <td colSpan={activeTab === "Completed" ? 6 : 5}>Loading...</td>
            </tr>
          )}
        </tbody>
      </table>
      <Pagination
        className="pagination-tab"
        count={Math.ceil(filteredRequests.length / requestsPerPage)}
        page={currentPage}
        variant="outlined"
        shape="rounded"
        color="secondary"
        onChange={handlePageChange}
      />

      <Modal 
        isOpen={showModal}
        onRequestClose={closeModal}
        contentLabel="Send SGK Modal"
        className="coordinator-rejection-modal"
        overlayClassName="overlay"
      >
        {selectedRequest && (
        console.log("selected request",selectedRequest),
          <div>
            <h2 className="coordinator-rejection-modal-h3">Send SGK for Request {selectedRequest.student.user.firstName + " " + selectedRequest.student.user.lastName}</h2>
            <h3 className="errmsg">{errorMessage}</h3>
            {/* Add your modal content here */}
            <label className="coordinator-rejection-modal-input">
              SGK Document:
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleSGKChange}/>
            </label>
            {approvingRequest ? (
                <CircularProgress size={20} />
            ) : ( 
                <>
            <button className="coordinator-rejection-modal-btn" onClick={closeModal}>Close</button>
            <button className="coordinator-rejection-modal-btn-confirm" onClick={() => handleApproveRequest(selectedRequest.id, selectedRequest.student.user.firstName, selectedRequest.student.user.lastName)}>Send</button>
            </>
            )}
          </div>
        )}
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default SGKRequests;
