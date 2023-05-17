import React, { useState, useEffect } from 'react';
import axios from '../../services/axios';
import { useAuthHeader } from 'react-auth-kit';
import Pagination from '@mui/material/Pagination';

import Modal from './RejectionModal';

const ApplicationRequestTable = ({ studentId }) => {
  const [applicationRequests, setApplicationRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 5;
  const authHeader = useAuthHeader();

  useEffect(() => {
    const fetchApplicationRequests = async () => {
      try {
        const response = await axios.get(`/application/${studentId}`, {
          headers: {
            authorization: authHeader(),
          },
        });
        setApplicationRequests(response.data.applicationRequests);
      } catch (error) {
        console.error('Error retrieving application requests:', error);
      }
    };

    fetchApplicationRequests();
  }, [studentId]);

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const handleOpenModal = (application) => {
    setSelectedApplication(application);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedApplication(null);
    setShowModal(false);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedApplicationRequests = applicationRequests.slice(startIndex, endIndex);

  const getStatusColor = (status) => {
    if (status === 'Rejected') {
      return 'red';
    } else if (status === 'Pending') {
      return 'grey';
    } else if (status === 'Completed') {
      return 'green';
    } else if (status === 'In Progress') {
      return 'orange';
    }
    return '';
  };

  const DownloadButton = ({ url, disabled, label }) => (
    <button
      className={`button-cell ${disabled ? 'disabled-button' : ''}`}
      onClick={() => {
        if (!disabled) {
          // Perform download logic here
          window.open(url);
          console.log(`Downloading ${label}`);
        }
      }}
      disabled={disabled}
    >
      {label}
    </button>
  );

  return (
    <div>
      <h2 className="table-heading">Application Requests</h2>
      {applicationRequests.length === 0 ? (
        <div className="no-data">No application requests to display</div>
      ) : (
        <table className="custom-table">
          <thead>
            <tr>
              <th className="table-header">Request Number</th>
              <th className="table-header">Date of Submission</th>
              <th className="table-header">Status</th>
              <th className="table-header">Response Date</th>
              <th className="table-header">SGK</th>
            </tr>
          </thead>
          <tbody>
            {paginatedApplicationRequests.map((request) => (
              <tr
                key={request.id}
                className="table-row"
                style={{
                  border: '1px solid #dddddd',
                  background: '#f3f3f3',
                  borderRadius: '4px',
                  padding: '10px',
                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                }}
              >
                <td className="table-data">{request.id}</td>
                <td className="table-data">{request.applicationDate.split('T')[0]}</td>
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
                <td className="table-data">{request.responseDate ? request.responseDate.split('T')[0] : ''}</td>
                <td className="table-data">
                  {request.status === 'Rejected' ? (
                    <button
                      className="button-cell rejected"
                      onClick={() => handleOpenModal(request)}
                    >
                      Rejection Reason
                    </button>
                  ) : (
                    <DownloadButton
                      url={request.SGKFileURL}
                      disabled={request.status !== 'Completed'}
                      label="Download SGK"
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {applicationRequests.length > itemsPerPage && (
        <Pagination
          className="pagination-tab"
          count={Math.ceil(applicationRequests.length / itemsPerPage)}
          variant="outlined"
          shape="rounded"
          color="secondary"
          page={currentPage}
          onChange={handleChangePage}
        />
      )}
      <Modal
        open={showModal}
        onClose={handleCloseModal}
        rejectionReason={selectedApplication?.rejectionReason}
        url={selectedApplication?.applicationFileURL}
      />
    </div>
  );
};

export default ApplicationRequestTable;
