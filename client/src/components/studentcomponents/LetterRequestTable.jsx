import React, { useState, useEffect } from "react";
import axios from "../../services/axios";
import { useAuthHeader } from "react-auth-kit";
import Pagination from "@mui/material/Pagination";

const LetterRequestTable = ({ studentId }) => {
  const [letterRequests, setLetterRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const authHeader = useAuthHeader();

  useEffect(() => {
    const fetchLetterRequests = async () => {
      try {
        const response = await axios.get(`/letterrequest/${studentId}`, {
          headers: {
            authorization: authHeader(),
          },
        });
        setLetterRequests(response.data.letterRequests);
      } catch (error) {
        console.error("Error retrieving letter requests:", error);
      }
    };

    fetchLetterRequests();
  }, [studentId]);

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedLetterRequests = letterRequests.slice(startIndex, endIndex);

  const getStatusColor = (status) => {
    if (status === "Rejected") {
      return "red";
    } else if (status === "Pending") {
      return "grey";
    } else if (status === "Approved") {
      return "green";
    }
    return "";
  };

  return (
    <div>
      <h2 className="table-heading">Letter Requests</h2>
      {letterRequests.length === 0 ? (
        <div className="no-data">No letter requests to display</div>
      ) : (
        <table className="custom-table">
          <thead>
            <tr>
              <th className="table-header">Request Number</th>
              <th className="table-header">Date of Submission</th>
              <th className="table-header">Status</th>
              <th className="table-header">Letter</th>
            </tr>
          </thead>
          <tbody>
            {paginatedLetterRequests.map((request) => (
              <tr
                key={request.id}
                className="table-row"
                style={{
                  border: "1px solid #dddddd",
                  background: "#f3f3f3",
                  borderRadius: "4px",
                  padding: "10px",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <td className="table-data">{request.id}</td>
                <td className="table-data">
                  {request.requestDate.split("T")[0]}
                </td>
                <td className="table-data">
                  <span
                    className="status bold"
                    style={{
                      color: getStatusColor(request.status),
                    }}
                  >
                    {request.status}
                  </span>
                </td>
                <td className="table-data">
                  <button
                    className={`button-cell ${
                      request.status === "Approved" ? "" : "disabled"
                    }`}
                    disabled={request.status !== "Approved"}
                  >
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {letterRequests.length > itemsPerPage && (
        <Pagination
          className="pagination-tab"
          count={Math.ceil(letterRequests.length / itemsPerPage)}
          variant="outlined"
          shape="rounded"
          color="secondary"
          page={currentPage}
          onChange={handleChangePage}
        />
      )}
    </div>
  );
};

export default LetterRequestTable;
