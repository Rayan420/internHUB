import React, { useState, useEffect } from 'react';
import axios from "../../services/axios";
import { useAuthHeader } from "react-auth-kit";
import { toast, ToastContainer } from "react-toastify";

const OpportunitiesComponent = ({ careerCenterId }) => {
  const [editingOpportunityId, setEditingOpportunityId] = useState(null);
  const [renewalOpportunityId, setRenewalOpportunityId] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editedOpportunity, setEditedOpportunity] = useState({});
  const [renewalOpportunity, setRenewalOpportunity] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const authHeader = useAuthHeader();

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const response = await axios.get(`/careercenter/oppurtunities/${careerCenterId}`, {
        headers: {
          authorization: authHeader(),
        },
      });
      setOpportunities(response.data.internshipOpportunities);
    } catch (error) {
      console.log('Error fetching opportunities:', error);
    }
  };

  const handleEdit = (opportunityId) => {
    const opportunityToEdit = opportunities.find((opportunity) => opportunity.id === opportunityId);
    setEditingOpportunityId(opportunityId);
    setRenewalOpportunityId(null);
    setEditedOpportunity(opportunityToEdit);
    setIsEditing(true);
    setRenewalOpportunity({});
  };

  const handleSave = async (opportunityId, updatedOpportunity, operationType) => {
    try {
      const res =await axios.put(`/careercenter/oppurtunities/${careerCenterId}/update/${opportunityId}/${operationType}`, updatedOpportunity, {
        headers: {
          authorization: authHeader(),
        },
      
      });
      if(res.status === 200){
        toast.success(`Internship post has been ${operationType}ed successfully!`);
      }
      else{
        toast.error(`Internship post ${operationType} has failed! please try again`);
      }
      setEditingOpportunityId(null);
      fetchOpportunities();
    } catch (error) {
      console.log('Error updating opportunity:', error);
    }
  };

  const handleRenew = (opportunityId) => {
    const renewedOpportunity = opportunities.find((opportunity) => opportunity.id === opportunityId);
    setRenewalOpportunityId(opportunityId);
    setRenewalOpportunity({
      startDate: renewedOpportunity.startDate || '',
      endDate: renewedOpportunity.endDate || '',
      applicationDeadline: renewedOpportunity.applicationDeadline || '',
    });
  };
  

  const handleDelete = async (opportunityId, careerCenterId) => {
    try {
      const res = await axios.delete(`/careercenter/oppurtunities/${careerCenterId}/delete/${opportunityId}`, {
        headers: {
          authorization: authHeader(),
          },});
      if(res.status === 200){
        toast.success(`Internship post has been deleted successfully!`);
      }
      else{
        toast.error(`Internship post deletion has failed! please try again`);
      }
      fetchOpportunities();
    } catch (error) {
      console.log('Error deleting opportunity:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredOpportunities = opportunities.filter(
    (opportunity) =>
      opportunity.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opportunity.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isExpired = (opportunity) => {
    const currentDate = new Date();
    const deadline = new Date(opportunity.applicationDeadline);
    return currentDate > deadline;
  };

  const renderEditingFields = () => {
    const {
      title,
      company,
      website,
      location,
      startDate,
      endDate,
      description,
      requirements,
      isPaid,
      amount,
      applicationLink,
      contactEmail,
      contactPhone,
      department,
      applicationDeadline,
      ...otherFields
    } = editedOpportunity;
  
    return (
      <div className="editing-fields">
        <label htmlFor="title">Title:</label>
        <input
          id="title"
          type="text"
          value={title || ''}
          onChange={(e) => setEditedOpportunity({ ...editedOpportunity, title: e.target.value })}
        />
  
        <label htmlFor="company">Company:</label>
        <input
          id="company"
          type="text"
          value={company || ''}
          onChange={(e) => setEditedOpportunity({ ...editedOpportunity, company: e.target.value })}
        />
  
        <label htmlFor="website">Website:</label>
        <input
          id="website"
          type="text"
          value={website || ''}
          onChange={(e) => setEditedOpportunity({ ...editedOpportunity, website: e.target.value })}
        />
  
        <label htmlFor="location">Location:</label>
        <input
          id="location"
          type="text"
          value={location || ''}
          onChange={(e) => setEditedOpportunity({ ...editedOpportunity, location: e.target.value })}
        />
  
        <label htmlFor="startDate">Start Date:</label>
        <input
          id="startDate"
          type="datetime-local"
          value={startDate || ''}
          onChange={(e) => setEditedOpportunity({ ...editedOpportunity, startDate: e.target.value })}
        />
  
        <label htmlFor="endDate">End Date:</label>
        <input
          id="endDate"
          type="datetime-local"
          value={endDate || ''}
          onChange={(e) => setEditedOpportunity({ ...editedOpportunity, endDate: e.target.value })}
        />
  
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description || ''}
          onChange={(e) => setEditedOpportunity({ ...editedOpportunity, description: e.target.value })}
        ></textarea>
  
        <label htmlFor="requirements">Requirements:</label>
        <textarea
          id="requirements"
          value={requirements || ''}
          onChange={(e) => setEditedOpportunity({ ...editedOpportunity, requirements: e.target.value })}
        ></textarea>
  
        <label htmlFor="isPaid">Paid:</label>
        <input
          id="isPaid"
          type="checkbox"
          checked={isPaid || false}
          onChange={(e) => setEditedOpportunity({ ...editedOpportunity, isPaid: e.target.checked })}
        />
  
        <label htmlFor="amount">Amount:</label>
        <input
          id="amount"
          type="number"
          value={amount || ''}
          onChange={(e) => setEditedOpportunity({ ...editedOpportunity, amount: parseInt(e.target.value) || null })}
        />
  
        <label htmlFor="applicationLink">Application Link:</label>
        <input
          id="applicationLink"
          type="text"
          value={applicationLink || ''}
          onChange={(e) => setEditedOpportunity({ ...editedOpportunity, applicationLink: e.target.value })}
        />
  
        <label htmlFor="contactEmail">Contact Email:</label>
        <input
          id="contactEmail"
          type="text"
          value={contactEmail || ''}
          onChange={(e) => setEditedOpportunity({ ...editedOpportunity, contactEmail: e.target.value })}
        />
  
        <label htmlFor="contactPhone">Contact Phone:</label>
        <input
          id="contactPhone"
          type="text"
          value={contactPhone || ''}
          onChange={(e) => setEditedOpportunity({ ...editedOpportunity, contactPhone: e.target.value })}
        />
  
        <label htmlFor="department">Department:</label>
        <input
          id="department"
          type="text"
          value={department || ''}
          onChange={(e) => setEditedOpportunity({ ...editedOpportunity, department: e.target.value })}
        />
  
        <label htmlFor="applicationDeadline">Application Deadline:</label>
        <input
          id="applicationDeadline"
          type="datetime-local"
          value={applicationDeadline || ''}
          onChange={(e) => setEditedOpportunity({ ...editedOpportunity, applicationDeadline: e.target.value })}
        />
  
        {/* Render additional fields here */}
  
        <div className="button-container">
        <button className='save' onClick={() => handleSave(editingOpportunityId, editedOpportunity, "Edit")}>Save</button>
        <button className='cancel' onClick={() => {setEditingOpportunityId(null), setIsEditing(false)}}>Cancel</button>
      </div>
        
      </div>
    );
  };
  

  const renderRenewalFields = () => {
    const { startDate, endDate, applicationDeadline } = renewalOpportunity;

    return (
      <div className="renewal-fields">
        <label htmlFor="startDate">Start Date:</label>
        <input
          id="startDate"
          type="datetime-local"
          value={startDate || ''}
          onChange={(e) => setRenewalOpportunity({ ...renewalOpportunity, startDate: e.target.value })}
        />

        <label htmlFor="endDate">End Date:</label>
        <input
          id="endDate"
          type="datetime-local"
          value={endDate|| ''}
          onChange={(e) => setRenewalOpportunity({ ...renewalOpportunity, endDate: e.target.value })}
        />
        <label htmlFor="endDate">End Date:</label>
        <input
          id="applicationDeadline"
          type="datetime-local"
          value={applicationDeadline || ''}
          onChange={(e) => setRenewalOpportunity({ ...renewalOpportunity, applicationDeadline: e.target.value })}
        />
        <div className="button-container">
          <button className='renew' onClick={() => handleSave(renewalOpportunityId, renewalOpportunity, "Renew")}>Renew</button>
          <button className='cancel' onClick={() => setRenewalOpportunityId(null)}>Cancel</button>
        </div>
        
      </div>
    );
  };

  return (
    <div className="opportunities-container">
      {
        isEditing? (
          renderEditingFields()
          
          ): 
          (
            <>
               <h2 className="opportunities-heading">Active Opportunities</h2>
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search by company name or title"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      {filteredOpportunities.length === 0 ? (
        <p className="no-opportunities-message">No internship opportunities found</p>
      ) : (
        <table className="opportunities-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Title</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Expired</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOpportunities.map((opportunity) => (
              <tr key={opportunity.id}>
                <td>{opportunity.company}</td>
                <td>{opportunity.title}</td>
                <td>{opportunity.startDate.split('T')[0]}</td>
                <td>{opportunity.endDate.split('T')[0]}</td>
                <td>{isExpired(opportunity) ? 'Yes' : 'No'}</td>
                <td>
                  
                      {renewalOpportunityId === opportunity.id ? (
                        renderRenewalFields()
                      ) : (
                        <>
                          {isExpired(opportunity) ? (
                            <>
                            <button className="renew-button" onClick={() => handleRenew(opportunity.id)}>Renew</button>
                            <button className="delete-button" onClick={() => handleDelete(opportunity.id, careerCenterId)}>Delete</button>
                            </>
                          ) : (
                            <button className="edit-button" onClick={() => handleEdit(opportunity.id)}>Edit</button>
                          )}
                          {!isExpired(opportunity) && (
                            <button className="delete-button" onClick={() => handleDelete(opportunity.id, careerCenterId)}>Delete</button>
                          )}
                        </>
                      )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
            
    </>
          )
        
      }
            <ToastContainer />

    </div>
  );
};

export default OpportunitiesComponent;
