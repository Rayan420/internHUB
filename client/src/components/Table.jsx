// This is a reusable custom table component for displaying data in a table format.
// It accepts an array of column names as 'columns' and an array of objects as 'data'.
// 'numButtons', 'buttonLabels', and 'buttonColors' are optional props to add buttons to each row of the table.
// 'noDataMessage' is an optional prop to display a message if no data is present.
// 'isDisabled' is an optional prop to disable the entire table if it is set to true.
// 'disableButtonCondition' is an optional prop to disable buttons based on a specific condition.
// The component uses state to paginate the data and display a pagination component if the number of items exceeds the items per page.
// The 'handleChangePage' function is called when a new page is selected and updates the current page in the component state.
// The component uses conditional rendering to display either the table or the no data message.
// Finally, the component exports with the 'CustomTable' name.

import React, { useState } from "react";
import PropTypes from "prop-types";
import Pagination from "@mui/material/Pagination";

const CustomTable = ({
  columns,
  data,
  numButtons,
  buttonLabels,
  buttonColors,
  noDataMessage,
  isDisabled,
  disableButtonCondition,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const renderTableHeader = () => {
    return (
      <tr>
        {columns.map((col) => (
          <th key={col}>{col}</th>
        ))}
        {numButtons > 0 && <th>Actions</th>}
      </tr>
    );
  };

  const renderTableData = () => {
    return paginatedData.map((row) => {
      const rowId = row.id || Math.floor(Math.random() * 1000000);
      const rowValues = Object.values(row);
      const buttons = [];
      for (let i = 0; i < numButtons; i++) {
        buttons.push(
          <button
            key={i}
            disabled={disableButtonCondition && row.status !== "Approved"}
            style={{ backgroundColor: buttonColors[i] }}
          >
            {buttonLabels[i]}
          </button>
        );
      }
      return (
        <tr key={rowId}>
          {rowValues.map((value, i) => (
            <td key={i}>{value}</td>
          ))}
          {numButtons > 0 && <td className="button-cell">{buttons}</td>}
        </tr>
      );
    });
  };

  return (
    <>
      {data.length === 0 ? (
        <div className="no-data">{noDataMessage}</div>
      ) : (
        <table>
          <thead>{renderTableHeader()}</thead>
          <tbody>{renderTableData()}</tbody>
        </table>
      )}
      {data.length > itemsPerPage && (
        <Pagination
          className="pagination-tab"
          count={Math.ceil(data.length / itemsPerPage)}
          variant="outlined"
          shape="rounded"
          color="secondary"
          page={currentPage}
          onChange={handleChangePage}
        />
      )}
    </>
  );
};

CustomTable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  numButtons: PropTypes.number,
  buttonLabels: PropTypes.arrayOf(PropTypes.string),
  buttonColors: PropTypes.arrayOf(PropTypes.string),
  noDataMessage: PropTypes.string,
  isDisabled: PropTypes.bool,
  disableButtonCondition: PropTypes.bool,
};

CustomTable.defaultProps = {
  numButtons: 0,
  buttonLabels: [],
  buttonColors: [],
  noDataMessage: "No data to display",
  isDisabled: false,
  disableButtonCondition: false,
};

export default CustomTable;
