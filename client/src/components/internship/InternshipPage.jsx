import React, { useState } from "react";
import PropTypes from "prop-types";

const InternshipPage = ({ internships }) => {
  const [selectedInternshipId, setSelectedInternshipId] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedLocation, setSelectedLocation] = useState("");

  const handleInternshipClick = (id) => {
    setSelectedInternshipId(id);
  };

  const handleApplyClick = (applicationLink) => {
    window.open(applicationLink, "_blank");
  };

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
  };

  const filteredInternships = internships.filter((internship) => {
    if (selectedLocation === "") {
      return true; // No filter selected, show all internships
    }
    return internship.location === selectedLocation;
  });

  const sortedInternships = filteredInternships.sort((a, b) => {
    if (sortOrder === "asc") {
      return new Date(a.startDate) - new Date(b.startDate);
    } else {
      return new Date(b.startDate) - new Date(a.startDate);
    }
  });

  // Get unique cities from internships
  const cities = Array.from(new Set(internships.map((internship) => internship.location)));

  return (
    <div className="internship-page-container">
      <div className="filter-container">
        {/* Filter by Location */}
        <div className="filter-location">
          <label htmlFor="location">Filter by Location:</label>
          <select id="location" value={selectedLocation} onChange={handleLocationChange}>
            <option value="">All Locations</option>
            {cities.map((city) => (
              <option value={city} key={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
        {/* Sort Order */}
        <div className="filter-sort">
          <label htmlFor="sort">Sort Order:</label>
          <select id="sort" onChange={(e) => setSortOrder(e.target.value)}>
            <option value="asc">Latest to Oldest</option>
            <option value="desc">Oldest to Latest</option>
          </select>
        </div>
      </div>
      <div className="internship-container">
        <div className="internship-list-container">
          <div className="internship-list">
            {sortedInternships.map((internship) => (
              <div
                className={`internship-card ${
                  internship.id === selectedInternshipId ? "selected" : ""
                }`}
                key={internship.id}
                onClick={() => handleInternshipClick(internship.id)}
              >
                <div className="internship-basic-info">
                  <div className="company-name">{internship.company}</div>
                  <div className="date-location">
                    <div className="date">
                      <strong>Date:</strong> {internship.startDate} - {internship.endDate}
                    </div>
                    <div className="location">
                      <strong>Location:</strong> {internship.location}
                    </div>
                  </div>
                  <div className="position-title">{internship.title}</div>
                </div>
              </div>
            ))}
            {sortedInternships.length === 0 && (
              <div className="internship-empty">No internships available.</div>
            )}
          </div>
        </div>
        <div className="internship-details-container">
          {selectedInternshipId && (
            <div className="internship-details">
              <div className="detail-title">Internship Details</div>
              <div className="detail-content">
                <div className="detail-row">
                  <div className="detail-label">Company:</div>
                  <div className="detail-value">
                    {internships.find((i) => i.id === selectedInternshipId).company}
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Location:</div>
                  <div className="detail-value">
                    {internships.find((i) => i.id === selectedInternshipId).location}
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Start Date:</div>
                  <div className="detail-value">
                    {internships.find((i) => i.id === selectedInternshipId).startDate}
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">End Date:</div>
                  <div className="detail-value">
                    {internships.find((i) => i.id === selectedInternshipId).endDate}
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Description:</div>
                  <div className="detail-value">
                    {internships.find((i) => i.id === selectedInternshipId).description}
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Requirements:</div>
                  <div className="detail-value">
                    {internships.find((i) => i.id === selectedInternshipId).requirements}
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Is Paid:</div>
                  <div className="detail-value">
                    {internships.find((i) => i.id === selectedInternshipId).isPaid ? "Yes" : "No"}
                  </div>
                </div>
                {internships.find((i) => i.id === selectedInternshipId).isPaid && (
                  <div className="detail-row">
                    <div className="detail-label">Amount:</div>
                    <div className="detail-value">
                      {internships.find((i) => i.id === selectedInternshipId).amount}
                    </div>
                  </div>
                )}
                <div className="detail-row">
                  <div className="detail-label">Contact Email:</div>
                  <div className="detail-value">
                    {internships.find((i) => i.id === selectedInternshipId).contactEmail}
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Contact Phone:</div>
                  <div className="detail-value">
                    {internships.find((i) => i.id === selectedInternshipId).contactPhone}
                  </div>
                </div>
                {internships.find((i) => i.id === selectedInternshipId).department && (
                  <div className="detail-row">
                    <div className="detail-label">Department:</div>
                    <div className="detail-value">
                      {internships.find((i) => i.id === selectedInternshipId).department}
                    </div>
                  </div>
                )}
                <div className="apply-button-row">
                  <button
                    className="apply-button"
                    onClick={() =>
                      handleApplyClick(
                        internships.find((i) => i.id === selectedInternshipId).applicationLink
                      )
                    }
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

InternshipPage.propTypes = {
  internships: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      company: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      startDate: PropTypes.string.isRequired,
      endDate: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      requirements: PropTypes.string.isRequired,
      isPaid: PropTypes.bool.isRequired,
      amount: PropTypes.number,
      contactEmail: PropTypes.string.isRequired,
      contactPhone: PropTypes.string.isRequired,
      applicationLink: PropTypes.string.isRequired,
      department: PropTypes.string,
    })
  ).isRequired,
};

export default InternshipPage;
