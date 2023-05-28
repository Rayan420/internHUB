import React, { useState, useEffect } from 'react';
import axios from '../../services/axios'
import { toast, ToastContainer } from "react-toastify";
import { useAuthHeader } from "react-auth-kit";

const DownloadFile = ({coordinatorId, }) => {
  const authHeader = useAuthHeader();

    const fetchApplicationForm = async () => {
      console.log(coordinatorId)
      try {
        // get forms
        const response = await axios.get(`/forms/retrieve/files/${coordinatorId}`, {
          headers: {
            authorization: authHeader(),
          },
        });
        console.log("response from download",response)
        toast.success("Application Form Downloaded successfully");
        return window.open(response.data.applicationForms.applicationFormURL, "_blank");
      } catch (error) {
        toast.error("Failed to download application forms, please try again whe you coordinator has uploaded the forms");
      }
       
    };

    const fetchReportForm = async () => {
      console.log(coordinatorId)
      try {
        // get forms
        const response = await axios.get(`/forms/retrieve/files/${coordinatorId}`, {
          headers: {
            authorization: authHeader(),
          },
        });
        console.log("response from download",response)
        toast.success("Report Form Downloaded successfully");
        return window.open(response.data.applicationForms.reportFormURL, "_blank");

      } catch (error) {
        toast.success("Failed to download report form, please try again whe you coordinator has uploaded the forms");
      }
      
       
    };


  
  

  return (
    <div className="request-card">
      <div className="request-card-content"><p>
                  Uskuadar University <br />
                  Internship forms
                </p></div>
      <div className="request-card-buttons">
        <button className="request-card-buttons" onClick={fetchApplicationForm}>Application</button>
        <button className="request-card-buttons" onClick={fetchReportForm}> Report</button>
      </div>
      <ToastContainer />

    </div>
  );
};


export default DownloadFile;
