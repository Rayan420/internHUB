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
const RequestViewer = ({ coordinatorId }) => {
  const authHeader = useAuthHeader();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [activeTab, setActiveTab] = useState("Pending");
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [requestsPerPage] = useState(5);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionReasonModal, setRejectionReasonModal] = useState("");
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [approvingRequest, setApprovingRequest] = useState(false); // Added state for spinner
  const [rejectingRequest, setRejectingRequest] = useState(false); // Added state for rejection spinner
  const [statusChange, setStatusChange] = useState(null);

  console.log("get requests for coordinator: ", coordinatorId)
  useEffect(() => {
    const fetchLetterRequests = async () => {
      try {
        const response = await axios.get(`/coordinator/requests/${coordinatorId}`, {
          headers: {
            Authorization: authHeader(),
          },
        });
        const { letterRequests } = response.data;
        setRequests(letterRequests);
      } catch (error) {
        console.error("Error fetching letter requests:", error);
      }
    };

    fetchLetterRequests();
  }, [coordinatorId, statusChange]);

  useEffect(() => {
    setFilteredRequests(requests.filter((request) => request.status === activeTab));
    setCurrentPage(1); // Reset current page when tab changes
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

  const handleViewRejectionReason = (requestId) => {
    const request = requests.find((req) => req.id === requestId);
    if (request) {
      setRejectionReasonModal(request.rejectionReason);
      setShowReasonModal(true);
    }
  };

  const handleApproveRequest = async (requestId) => {
    try {
      setApprovingRequest(true); // Start spinner
      const response = await axios.get(`/coordinator/signature/${coordinatorId}`, {
        headers: {
          authorization: authHeader(),
        },
      });
  
      if (!response.data.signatureURL) {
        // Coordinator does not have a registered signature
      toast.error("Please upload your signature before approving requests.");
      setApprovingRequest(false); // Stop spinner
        return;
      }
      await axios.post(`/respondToLetter/${requestId}/Approved`, null, {
        headers: {
          Authorization: authHeader(),
        },
      });
      // Request approved, handle any necessary updates or notifications
      setStatusChange({ requestId, status: "Approved" });
      setApprovingRequest(false); // Stop spinner
      toast.success(<span>Letter {requestId} has been <span className="bold approved">Approved</span> successfully!</span>);
      // Update the requests state to reflect the status change
    setRequests((prevRequests) =>
    prevRequests.map((request) =>
      request.id === requestId ? { ...request, status: 'Approved' } : request
    )
  );

    } catch (error) {
      console.error("Error approving letter request:", error);
    }
  };

  const handleRejectRequest = async (requestId) => {
    setSelectedRequestId(requestId);
    setShowRejectionModal(true);
  };

  const handleConfirmRejection = async () => {
    try {
      setRejectingRequest(true); // Start spinner
      const response = await axios.post(
        `/respondToLetter/${selectedRequestId}/Rejected`,
        { rejectionReason },
        {
          headers: {
            Authorization: authHeader(),
          },
        }
      );
      // Request rejected, handle any necessary updates or notifications
      // Update the requests state to reflect the status change
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === selectedRequestId ? { ...request, status: 'Rejected' } : request
        )
      );
      setRejectionReason("");
      if (response.status === 200) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      setRejectingRequest(false); // Stop spinner
      toast.success(
        <span>
          Letter {selectedRequestId} has been <span className="bold-errmsg">Rejected</span> successfully!
        </span>
      );
    } catch (error) {
      console.error("Error rejecting letter request:", error);
      // Handle error or show error message to the user
    } finally {
      setShowRejectionModal(false); // Close the modal
    }
  };
  


  const handleDeleteRequest = (requestId) => {
    // Implement the logic to delete the request with the given ID
  };

  const renderPendingRequest = (request) => {
    return (
      <tr key={request.id}>
        <td>{request.id}</td>
      <td>{request.requestDate ? request.requestDate.split("T")[0] : ""}</td>
      <td className={`status-pending ${statusChange && statusChange.requestId === request.id && "status-change"}`}>
        {request.status}
      </td>
        <td>
          <a
            className="view-transcript-text"
            target="_blank"
              href={request.transcriptFileURL}
           
            rel="noopener noreferrer"
          >
            View
          </a>
        </td>
        <td>
          {/* Conditional rendering of spinner */}
          {approvingRequest ? (
            <CircularProgress size={20} />
          ) : (
            <>
              <button className="button-approve" onClick={() => handleApproveRequest(request.id)}>
                Approve
              </button>
              <button className="button-delete" onClick={() => handleRejectRequest(request.id)}>
                Reject
              </button>
            </>
          )}
        </td>
      </tr>
    );
  };

  const renderApprovedRequest = (request) => {
    return (
      <tr key={request.id}>
        <td>{request.id}</td>
      <td>{request.requestDate ? request.requestDate.split("T")[0] : ""}</td>
      <td className={`status-approved ${statusChange && statusChange.requestId === request.id && "status-change"}`}>
        {request.status}
      </td>
        <td>{request.approvalDate ? request.approvalDate.split("T")[0] : ""}</td>
        <td>
          <a href={request.transcriptFileURL} target="_blank" rel="noopener noreferrer">
            View
          </a>
        </td>
        <td>
          <a href={request.Letter} target="_blank" rel="noopener noreferrer">
            View
          </a>
        </td>
        <td>
          <button className="button-delete" onClick={() => handleDeleteRequest(request.id)}>
            Delete
          </button>
        </td>
      </tr>
    );
  };

  const renderRejectedRequest = (request) => {
    return (
      <tr key={request.id}>
        <td>{request.id}</td>
      <td>{request.requestDate ? request.requestDate.split("T")[0] : ""}</td>
      <td className={`status-rejected ${statusChange && statusChange.requestId === request.id && "status-change"}`}>
        {request.status}
      </td>
        <td>{request.approvalDate ? request.approvalDate.split("T")[0] : ""}</td>
        <td>
          <a href={request.transcriptFileURL} target="_blank" rel="noopener noreferrer">
            View
          </a>
        </td>
        <td>
          <button onClick={() => handleViewRejectionReason(request.id)}>View Reason</button>
          <button className="button-delete" onClick={() => handleDeleteRequest(request.id)}>
            Delete
          </button>
        </td>
      </tr>
    );
  };

  // Get current requests based on pagination
  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  return (
    <div className="coordinator-container">
      <h2>Letter Requests</h2>
      <div className="coordinator-search-bar">
        <label>Search by ID:</label>
        <input type="text" value={searchId} onChange={(e) => setSearchId(e.target.value)} />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className="coordinator-tab-buttons">
        <button className={activeTab === "Pending" ? "active" : ""} onClick={() => handleTabChange("Pending")}>
          Pending
        </button>
        <button className={activeTab === "Approved" ? "active" : ""} onClick={() => handleTabChange("Approved")}>
          Approved
        </button>
        <button className={activeTab === "Rejected" ? "active" : ""} onClick={() => handleTabChange("Rejected")}>
          Rejected
        </button>
      </div>
      <table className="coordinator-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Request Date</th>
            <th>Status</th>
            {activeTab !== "Pending" && <th>Response Date</th>}
            <th>Transcript</th>
            {activeTab === "Approved" && <th>Letter</th>}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentRequests.map((request) => {
            if (activeTab === "Pending") {
              return renderPendingRequest(request);
            } else if (activeTab === "Approved") {
              return renderApprovedRequest(request);
            } else if (activeTab === "Rejected") {
              return renderRejectedRequest(request);
            }
            return null;
          })}
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

      {/* Rejection Reason Modal */}
      <Modal Modal className="coordinator-rejection-modal"
        isOpen={showReasonModal}
        onRequestClose={() => setShowReasonModal(false)}
        contentLabel="Rejection Reason"
      >
        <h3 className="coordinator-rejection-modal-h3">Rejection Reason</h3>
        <p className="rejection-reason-coordinator">{rejectionReasonModal}</p>
        <button className="coordinator-rejection-modal-btn-confirm" onClick={() => setShowReasonModal(false)}>Close</button>
      </Modal>

      {/* Rejection Confirmation Modal */}
      <Modal
        className="coordinator-rejection-modal"
        isOpen={showRejectionModal}
        onRequestClose={() => setShowRejectionModal(false)}
        contentLabel="Confirm Rejection"
      >
        <h3 className="coordinator-rejection-modal-h3">Confirm Rejection</h3>
        <label htmlFor="rejectionReason">Reason for rejection:</label>
        <textarea
          className="coordinator-rejection-modal-input"
          id="rejectionReason"
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
        />
        {/* Conditional rendering of spinner */}
        {rejectingRequest ? (
          <CircularProgress size={20} />
        ) : (
          <>
            <button className="coordinator-rejection-modal-btn-confirm" onClick={handleConfirmRejection}>
              Confirm
            </button>
            <button className="coordinator-rejection-modal-btn" onClick={() => setShowRejectionModal(false)}>
              Cancel
            </button>
          </>
        )}
      </Modal>
      <ToastContainer />

    </div>
  );
};

export default RequestViewer;
