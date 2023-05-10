import { useState, useEffect } from 'react';
import axios from '../../services/axios';
import { useAuthHeader } from "react-auth-kit";

const AddNewUser = () => {
  const authHeader = useAuthHeader();
  const [userType, setUserType] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [department, setDepartment] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [careerCenterEmail, setCareerCenterEmail] = useState("");
  const [Msg, setMsg] = useState("");


useEffect(() => {
  let domain;
  switch (userType) {
    case "student":
      domain = "st.uskudar.edu";
      break;
    case "coordinator":
      domain = "uskudar.edu.tr";
      break;
    
    default:
      domain = "";
  }
  setEmail(`${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`);
  setPassword( Math.random().toString(36).substring(7));
}, [firstName, lastName, userType]);

  const handleUserTypeChange = (event) => {
    setUserType(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Perform form submission logic here
    switch (userType) {
        case "coordinator":
            axios.post("/coordinator", 
            {
                email: email,
                password: password,
                firstName: firstName,
                lastName: lastName,
                phoneNum: phoneNum,
                department: department,
            }, {
                headers: {
                  authorization: authHeader(),
                },
              }).then((res) => {
                setMsg(res.data.message);
            }).catch((err) => {
                setMsg(err.response.data.message);
            },)
            break;
    
        default:
            setMsg("Please fill out the form.");
            break;
    }
  };

  const renderInputFields = () => {
    switch (userType) {
      case "Coordinator":
        return (
          <>
            <label htmlFor="department">Department</label>
            <input
              type="text"
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
            <label htmlFor="studentNumber">Student Number</label>
            <input
              type="text"
              id="studentNumber"
              value={studentNumber}
              onChange={(e) => setStudentNumber(e.target.value)}
            />
          </>
        );
      case "coordinator":
        return (
          <>
            <label htmlFor="department">Department</label>
            <input
              type="text"
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </>
        );
      case "careerCenter":
        return (
          <>
            <label htmlFor="companyName">Company Name</label>
            <input
              type="text"
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="create-user">
    <h2>Create User</h2>
    <h3 className='errmsg'>{Msg}</h3>
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="userType">User Type</label>
        <select id="userType" value={userType} onChange={handleUserTypeChange}>
          <option value=""></option>
          <option value="student">Student</option>
          <option value="coordinator">Coordinator</option>
          <option value="careerCenter">Career Center</option>
        </select>
      </div>
      <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="form-group">
            <label htmlFor="email">Email</label>
                {userType === "careerCenter" ? (
                <input 
                type="email" 
                id="email" 
                value={careerCenterEmail} 
                onChange={(e) => setCareerCenterEmail(e.target.value)} 
                />
                ) : (
                <input
                type="email"
                id="email"
                value={email}
                readOnly
                />
                )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="text"
            id="password"
            value={password}
            readOnly
          />
        </div>
        <div className="form-group">
          <label htmlFor="phoneNum">Phone Number</label>
          <input
            type="tel"
            id="phoneNum"
            value={phoneNum}
            onChange={(e) => setPhoneNum(e.target.value)}
          />
          </div>
          {renderInputFields()}
          <button type="submit">Create User</button>
        </form>
      </div>
      
    );
  };


export default AddNewUser;

