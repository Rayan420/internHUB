import { useState } from 'react';
import React from 'react';
import Pagination from '@mui/material/Pagination';

const ApplicationSummary = ({ data }) => {
  // Set initial page state to 1
  const [page, setPage] = useState(1);

  // Set number of rows per page
  const rowsPerPage = 5;

  // Calculate the number of pages needed based on the length of the data array and the number of rows per page
  const pageCount = Math.ceil(data.length / rowsPerPage);

  // Handle page changes
  const handleChangePage = (event, value) => {
    setPage(value);
  };

  // Calculate the start and end indexes of the rows to be displayed on the current page
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  // Generate rows to be displayed on the current page using the data array
  const rows = data
    .slice(startIndex, endIndex)
    .map((row) => (
      <tr key={row.id}>
        <td>{row.studentId}</td>
        <td>{row.student}</td>
        <td>{row.department}</td>
        <td>{row.coordinator}</td>
        <td>{row.appId}</td>
        <td className={row.status}>
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </td>
      </tr>
    ));

  return (
    <div className='admin-application-summary'>
      {/* Application Summary title */}
      <h2 className='aaps-title'>Application Summary</h2>

      {/* Show message if there are no applications */}
      {data.length === 0 ? (
        <p className='aaps-no-data-message'>
          There are no applications to show 😊
        </p>
      ) : (
        <>
          {/* Show table if there are applications */}
          <table className='styled-table'>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Student</th>
                <th>Department</th>
                <th>Coordinator</th>
                <th>App. ID</th>
                <th>Approved/Rejected</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </table>

          {/* Show pagination component if there are multiple pages */}
          <Pagination
            className='pagination-tab'
            count={pageCount}
            variant='outlined'
            shape='rounded'
            color='secondary'
            page={page}
            onChange={handleChangePage}
          />
        </>
      )}
    </div>
  );
};

export default ApplicationSummary;
