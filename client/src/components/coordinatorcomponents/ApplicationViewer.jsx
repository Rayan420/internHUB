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
const ApplicationViewe = ({ coordinatorId }) => {
    const authHeader = useAuthHeader();
    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [searchId, setSearchId] = useState("");
    const [activeTab, setActiveTab] = useState("Pending");
    const [showRejectionModal, setShowRejectionModal] = useState(false);
    const [selectedRequestId, setSelectedRequestId] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [requestsPerPage] = useState(10);
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
          const response = await axios.get(`/coordinator/requests/${coordinatorId}/applications`, {
            headers: {
              authorization: authHeader(),
            },
          });
          const { applications } = response.data;
              console.log("requests: ", applications)
          setRequests(applications);
        } catch (error) {
          console.error("Error fetching letter requests:", error);
        }
      };
  
      fetchLetterRequests();
    }, [coordinatorId, statusChange]);
    useEffect(() => {
      if (requests) {
        setFilteredRequests(requests.filter((request) => request.status === activeTab));
        setCurrentPage(1); // Reset current page when tab changes
      }
    }, [requests, activeTab]);

  const handleSearch = () => {
    const filtered = requests.filter((request) => request.student.studentNumber.toString().includes(searchId));
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
      const res = await axios.put(`/applications/response/${requestId}/Approved`, null, {
        headers: {
          authorization: authHeader(),
        },
      });
      // Request approved, handle any necessary updates or notifications
      if(res.status === 202){
        toast.error(res.data.message);
        setApprovingRequest(false); // Stop spinner
        return;

      }
      setStatusChange({ requestId, status: "In Progress" });
      setApprovingRequest(false); // Stop spinner
      toast.success(<span>Letter {requestId} has been <span className="bold approved">Approved</span> successfully!</span>);
      // Update the requests state to reflect the status change
    setRequests((prevRequests) =>
    prevRequests.map((request) =>
      request.id === requestId ? { ...request, status: 'Approved' } : request
    )
  );

    } catch (error) {
      if(res.status === 404 || res.status === 400){
        toast.error(res.data.message);
        setApprovingRequest(false); // Stop spinner
        return;
      }
        }
  };

  const handleRejectRequest = async (requestId) => {
    setSelectedRequestId(requestId);
    setShowRejectionModal(true);
  };

  const handleConfirmRejection = async () => {
    try {
      setRejectingRequest(true); // Start spinner
      const response = await axios.put(
        `/applications/response/${selectedRequestId}/Rejected`,
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
        <td>{request.student.studentNumber}</td>
        <td>{request.applicationDate ? request.applicationDate.split("T")[0] : ""}</td>
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
          <a href={request.applicationFileURL} target="_blank" rel="noopener noreferrer">
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
  
  const renderCompletedRequest = (request) => {
    return (
      <tr key={request.id}>
        <td>{request.id}</td>
        <td>{request.student.studentNumber}</td>
        <td>{request.applicationDate ? request.applicationDate.split("T")[0] : ""}</td>
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
          <a href={request.applicationFileURL} target="_blank" rel="noopener noreferrer">
            View
          </a>
        </td>
            {request.sgkStatus === "Sent" && request.sgkFileURL ? (
                <td>
                <a href={request.sgkFileURL} target="_blank" rel="noopener noreferrer">
                  View
                </a>
              </td>) : (
                <td>N/A</td>
              ) 
            }
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
        <td>{request.student.studentNumber}</td>
        <td>{request.applicationDate ? request.applicationDate.split("T")[0] : ""}</td>
        <td className={`status-rejected ${statusChange && statusChange.requestId === request.id && "status-change"}`}>
          {request.status}
        </td>
        <td>{request.responseDate ? request.responseDate.split("T")[0] : ""}</td>
        <td>
          <a href={request.transcriptFileURL} target="_blank" rel="noopener noreferrer">
            View
          </a>
        </td>
        <td>
          <a href={request.applicationFileURL} target="_blank" rel="noopener noreferrer">
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
  
  const renderInProgressRequest = (request) => {
    return (
      <tr key={request.id}>
        <td>{request.id}</td>
        <td>{request.student.studentNumber}</td>
        <td>{request.applicationDate ? request.applicationDate.split("T")[0] : ""}</td>
        <td className={`status-completed ${statusChange && statusChange.requestId === request.id && "status-change"}`}>
          {request.status}
        </td>
        <td>{request.approvalDate ? request.approvalDate.split("T")[0] : ""}</td>
        <td>
          <a href={request.transcriptFileURL} target="_blank" rel="noopener noreferrer">
            View
          </a>
        </td>
        
        <td>
          <a href={request.applicationFileURL} target="_blank" rel="noopener noreferrer">
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


  // Get current requests based on pagination
  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  return (
    <div className="coordinator-container">
      <h2>Application Requests</h2>
      <div className="coordinator-search-bar">
        <label>Search by ID:</label>
        <input type="text" value={searchId} onChange={(e) => setSearchId(e.target.value)} />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className="coordinator-tab-buttons">
            <button className={activeTab === "Pending" ? "active" : ""} onClick={() => handleTabChange("Pending")}>
                Pending
            </button>
            <button className={activeTab === "In Progress" ? "active" : ""} onClick={() => handleTabChange("In Progress")}>
                In progress
            </button>
            <button className={activeTab === "Rejected" ? "active" : ""} onClick={() => handleTabChange("Rejected")}>
                Rejected
            </button>
            <button className={activeTab === "Completed" ? "active" : ""} onClick={() => handleTabChange("Completed")}>
                Completed
            </button>
        </div>

      <table className="coordinator-table">
        <thead>
          <tr>
            <th>Application Number</th>
            <th>Student ID</th>
            <th>Request Date</th>
            <th>Status</th>
            {activeTab !== "Pending" && <th>Response Date</th>}
            <th>Transcript</th>
            <th>Application Form</th>
            {activeTab === "Completed" && <th>SGK</th>}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentRequests.map((request) => {
            if (activeTab === "Pending") {
              return renderPendingRequest(request);
            } else if (activeTab === "Completed") {
              return renderCompletedRequest(request);
            } else if (activeTab === "In Progress") {
                return renderInProgressRequest(request);
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

export default ApplicationViewe;
