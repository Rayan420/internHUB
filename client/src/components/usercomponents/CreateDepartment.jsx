import React, { useState } from 'react';
import axios from 'axios';

const CreateDepartment = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
  };

  return (
    <div className="create-department-container">
    <h1 className="create-department-title">Create Department</h1>
    <form className="create-department-form" onSubmit={handleSubmit}>
      <div className="create-department-field">
        <label className="create-department-label" htmlFor="name">Name:</label>
        <input className="create-department-input" type="text" id="name" value={name} onChange={handleNameChange} />
      </div>
      <div className="create-department-field">
        <label className="create-department-label" htmlFor="description">Description:</label>
        <textarea className="create-department-input" id="description" value={description} onChange={handleDescriptionChange} />
      </div>
      
      <button className="create-department-button" type="submit">Create Department</button>
      <button className="delete-department-button" type="submit">Delete Department</button>
      
    </form>
  </div>
  
  );
}

export default CreateDepartment;
