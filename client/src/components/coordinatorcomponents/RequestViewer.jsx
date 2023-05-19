import React, { useState, useEffect } from "react";
import axios from "../../services/axios";
import { useAuthHeader } from "react-auth-kit";
import RejectionModal from "../studentcomponents/RejectionModal";
import Pagination from "@mui/material/Pagination";

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
  }, []);

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
    setSelectedRequestId(requestId);
    setShowRejectionModal(true);
  };

  const handleApproveRequest = (requestId) => {
    // Implement the logic to approve the request with the given ID
  };

  const handleDeleteRequest = (requestId) => {
    // Implement the logic to delete the request with the given ID
  };
  const handleRejectRequest = (requestId) => {
    // Implement the logic to delete the request with the given ID
  };

  const renderPendingRequest = (request) => {
    return (
      <tr key={request.id}>
        <td>{request.id}</td>
        <td>{request.requestDate ? request.requestDate.split("T")[0] : ""}</td>
        <td className="status-pending">{request.status}</td>
        <td>
          <a className="view-transcript-text" href={request.transcriptFileURL} target="_blank" rel="noopener noreferrer">
            View
          </a>
        </td>
        <td>
          <button className="button-approve" onClick={() => handleApproveRequest(request.id)}>
            Approve
          </button>
          <button className="button-delete" onClick={() => handleRejectRequest(request.id)}>
            Reject
          </button>
        </td>
      </tr>
    );
  };

  const renderApprovedRequest = (request) => {
    return (
      <tr key={request.id}>
        <td>{request.id}</td>
        <td>{request.requestDate ? request.requestDate.split("T")[0] : ""}</td>
        <td className="status-approved">{request.status}</td>
        <td>{request.approvalDate ? request.approvalDate.split("T")[0] : ""}</td>
        <td>
          <a href={request.transcriptFileURL} target="_blank" rel="noopener noreferrer">
            View
          </a>
        </td>
        <td>
          <a href={request.letterFileURL} target="_blank" rel="noopener noreferrer">
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
        <td className="status-rejected">{request.status}</td>
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
      <div className="coordinator-request-list">
        <h3>{activeTab} Requests</h3>
        {currentRequests.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Request Date</th>
                <th className="status-header">Status</th>
                {activeTab === "Approved" && <th>Approval Date</th>}
                <th>Transcript File</th>
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
        ) : (
          <p className="coordinator-message">No {activeTab} requests found.</p>
        )}
      </div>
      <Pagination
        className="pagination-tab"
        count={Math.ceil(filteredRequests.length / requestsPerPage)}
        variant="outlined"
        shape="rounded"
        color="secondary"
        page={currentPage}
        onChange={handlePageChange}
      />
      {showRejectionModal && (
        <RejectionModal requestId={selectedRequestId} onClose={() => setShowRejectionModal(false)} />
      )}
    </div>
  );
};

export default RequestViewer;
