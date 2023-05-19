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
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState(false);

  const updateEmail = () => {
    let domain = "";
    switch (userType) {
      case "Student":
        domain = "st.uskudar.edu";
        break;
      case "Coordinator":
        domain = "uskudar.edu.tr";
        break;
      default:
        domain = "";
    }
    setEmail(`${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`);
  };

  useEffect(() => {
    updateEmail();
  }, [firstName, lastName, userType]);

  const handleUserTypeChange = (event) => {
    setUserType(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Perform form submission logic here
    switch (userType) {
      case "Coordinator":
        axios
          .post(
            "/coordinator",
            {
              email: email,
              password: password,
              firstName: firstName,
              lastName: lastName,
              phoneNum: phoneNum,
              department: department,
            },
            {
              headers: {
                authorization: authHeader(),
              },
            }
          )
          .then((res) => {
            setSuccessMsg(res.data.message);
            setError(false);
            setMsg("");
          })
          .catch((err) => {
            setMsg(err.response.data.message);
            setError(true);
            setSuccessMsg("");
          });
        break;
      case "Student":
        axios
          .post(
            "/student",
            {
              email: email,
              password: password,
              firstName: firstName,
              lastName: lastName,
              phoneNum: phoneNum,
              department: department,
              studentNumber: studentNumber,
            },
            {
              headers: {
                authorization: authHeader(),
              },
            }
          )
          .then((res) => {
            setSuccessMsg(res.data.message);
            setError(false);
            setMsg("");
          })
          .catch((err) => {
            setMsg(err.response.data.message);
            setError(true);
            setSuccessMsg("");
          });
        break;
      case "Careercenter":
        axios
          .post(
            "/careercenter",
            {
              email: careerCenterEmail,
              password: password,
              firstName: firstName,
              lastName: lastName,
              phoneNum: phoneNum,
              companyName: companyName,
            },
            {
              headers: {
                authorization: authHeader(),
              },
            }
          )
          .then((res) => {
            setSuccessMsg(res.data.message);
            setError(false);
            setMsg("");
          })
          .catch((err) => {
            setMsg(err.response.data.message);
            setError(true);
            setSuccessMsg("");
          });
        break;
      default:
        setMsg("Please fill out the form.");
        break;
    }
  };

  const renderInputFields = () => {
    switch (userType) {
      case "Student":
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
          </>
        );
      case "Careercenter":
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

  const handleCareerCenterEmailChange = (event) => {
    setCareerCenterEmail(event.target.value);
  };

  return (
    <div className="create-user">
      <h2>Create User</h2>
      <h3 className="errmsg">{Msg}</h3>
      <h3 className="successmsg">{successMsg}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="userType">User Type</label>
          <select id="userType" value={userType} onChange={handleUserTypeChange}>
            <option value=""></option>
            <option value="Student">Student</option>
            <option value="Coordinator">Coordinator</option>
            <option value="Careercenter">Career Center</option>
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
          {userType === "Careercenter" ? (
            <input
              type="email"
              id="email"
              value={careerCenterEmail}
              onChange={handleCareerCenterEmailChange}
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
            onChange={(e) => setPassword(e.target.value)}
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
