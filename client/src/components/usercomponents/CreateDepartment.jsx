import React, { useState } from "react";
import axios from "../../services/axios";
import { useAuthHeader } from "react-auth-kit";

const CreateDepartment = () => {
  const authHeader = useAuthHeader();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [Msg, setMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleCodeChange = (event) => {
    setCode(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Perform form submission logic here
    await axios
      .post(
        "/department",
        {
          name: name,
          code: code,
        },
        {
          headers: {
            authorization: authHeader(),
          },
        }
      )
      .then((res) => {
        setSuccessMsg(res.data.message);
        setMsg("");
      })
      .catch((err) => {
        setMsg(err.response.data.message);
        setSuccessMsg("");
      });
  };

  return (
    <div className="create-department-container">
      <h1 className="create-department-title">Create Department</h1>
      <form className="create-department-form" onSubmit={handleSubmit}>
        <h3 className="errmsg">{Msg}</h3>
        <h3 className=" successmsg">{successMsg}</h3>
        <div className="create-department-field">
          <label className="create-department-label" htmlFor="name">
            Name:
          </label>
          <input
            className="create-department-input"
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
          />
        </div>
        <div className="create-department-field">
          <label className="create-department-label" htmlFor="code">
            Code:
          </label>
          <input
            className="create-department-input"
            type="text"
            id="name"
            value={code}
            onChange={handleCodeChange}
          />
        </div>

        <button className="create-department-button" type="submit">
          Create Department
        </button>
        <button className="delete-department-button" type="submit">
          Delete Department
        </button>
      </form>
    </div>
  );
};

export default CreateDepartment;