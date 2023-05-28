import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "../../services/axios";
import { useAuthHeader } from "react-auth-kit";

const CreateInternshipOpportunity = ({careerCenterId}) => {
  const authHeader = useAuthHeader();
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    website: "",
    location: "",
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10),
    description: "",
    requirements: "",
    isPaid: false,
    amount: "",
    applicationLink: "",
    contactEmail: "",
    contactPhone: "",
    department: "",
    applicationDeadline: new Date().toISOString().slice(0, 10),
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: fieldValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const formattedData = {
          ...formData,
          startDate: new Date(formData.startDate),
          endDate: new Date(formData.endDate),
          applicationDeadline: new Date(formData.applicationDeadline),
        };

        await axios.post("/careercenter/create/"+careerCenterId,
        formattedData, {
          headers: {
            authorization: authHeader(),
          },
        });

        // Show success toast notification
        toast.success("Internship opportunity created successfully!");
        clearFormData();
      } catch (error) {
        console.error("Error creating internship opportunity", error);
        toast.error("Error creating internship opportunity.");
      }
    }
  };

  const clearFormData = () => {
    setFormData({
      title: "",
      company: "",
      website: "",
      location: "",
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date().toISOString().slice(0, 10),
      description: "",
      requirements: "",
      isPaid: false,
      amount: "",
      applicationLink: "",
      contactEmail: "",
      contactPhone: "",
      department: "",
      applicationDeadline: new Date().toISOString().slice(0, 10),
    });
  };
  

  const validateForm = () => {
    let isValid = true;
    const errors = {};
  
    // Validate important fields
    if (!formData.title.trim()) {
      errors.title = "Please enter a title.";
      isValid = false;
    }
  
    if (!formData.company.trim()) {
      errors.company = "Please enter a company name.";
      isValid = false;
    }
  
    if (!formData.location.trim()) {
      errors.location = "Please enter a location.";
      isValid = false;
    }
  
    if (!formData.description.trim()) {
      errors.description = "Please enter a description.";
      isValid = false;
    }
  
    if (!formData.requirements.trim()) {
      errors.requirements = "Please enter requirements.";
      isValid = false;
    }
  
    if (!formData.applicationLink.trim()) {
      errors.applicationLink = "Please enter an application link.";
      isValid = false;
    }
  
    if (!formData.department.trim()) {
      errors.department = "Please enter a department.";
      isValid = false;
    }
  
    if (!formData.applicationDeadline.trim()) {
      errors.applicationDeadline = "Please enter an application deadline.";
      isValid = false;
    }
  
    // Validate date fields
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      errors.dates = "Start date must be before end date.";
      isValid = false;
    }
  
    if (new Date(formData.applicationDeadline) >= new Date(formData.startDate)) {
      errors.dates = "Application deadline must be before the start date.";
      isValid = false;
    }
  
    // Display error toast notifications
    Object.keys(errors).forEach((fieldName) => {
      const errorMsg = errors[fieldName];
      toast.error(errorMsg);
    });
  
    return isValid;
  };
  

  return (
    <div>
      <h2>Create Internship Opportunity</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title:<span className="required-field">*</span></label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />

        <label htmlFor="company">Company:<span className="required-field">*</span></label>
        <input
          type="text"
          id="company"
          name="company"
          value={formData.company}
          onChange={handleChange}
        />

        <label htmlFor="website">Website:</label>
        <input
          type="text"
          id="website"
          name="website"
          value={formData.website}
          onChange={handleChange}
        />

        <label htmlFor="location">Location:<span className="required-field">*</span></label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
        />

        <label htmlFor="startDate">Start Date:<span className="required-field">*</span></label>
        <input
          type="datetime-local"
          id="startDate"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
        />

        <label htmlFor="endDate">End Date:<span className="required-field">*</span></label>
        <input
          type="datetime-local"
          id="endDate"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
        />

        <label htmlFor="description">Description:<span className="required-field">*</span></label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        ></textarea>

        <label htmlFor="requirements">Requirements:<span className="required-field">*</span></label>
        <textarea
          id="requirements"
          name="requirements"
          value={formData.requirements}
          onChange={handleChange}
        ></textarea>

        <label htmlFor="isPaid">Paid:</label>
        <input
          type="checkbox"
          id="isPaid"
          name="isPaid"
          checked={formData.isPaid}
          onChange={handleChange}
        />

        {formData.isPaid && (
          <div>
            <label htmlFor="amount">Amount:</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
            />
          </div>
        )}

        <label htmlFor="applicationLink">Application Link:<span className="required-field">*</span></label>
        <input
          type="text"
          id="applicationLink"
          name="applicationLink"
          value={formData.applicationLink}
          onChange={handleChange}
        />

        <label htmlFor="contactEmail">Contact Email:</label>
        <input
          type="email"
          id="contactEmail"
          name="contactEmail"
          value={formData.contactEmail}
          onChange={handleChange}
        />

        <label htmlFor="contactPhone">Contact Phone:</label>
        <input
          type="text"
          id="contactPhone"
          name="contactPhone"
          value={formData.contactPhone}
          onChange={handleChange}
        />

        <label htmlFor="department">Department:<span className="required-field">*</span></label>
        <input
          type="text"
          id="department"
          name="department"
          value={formData.department}
          onChange={handleChange}
        />

        <label htmlFor="applicationDeadline">Application Deadline:<span className="required-field">*</span></label>
        <input
          type="datetime-local"
          id="applicationDeadline"
          name="applicationDeadline"
          value={formData.applicationDeadline}
          onChange={handleChange}
        />

        <div className="create-internship-form-group">
          <label htmlFor="submitButton">&nbsp;</label>
          <button id="submitButton" type="submit">
            Create
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default CreateInternshipOpportunity;
