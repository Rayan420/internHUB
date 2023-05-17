import SideNavbar from "../components/NavBar"; // import the side navbar component
import Header from "../components/Header"; // import the header component
import WelcomeCard from "../components/WelcomeCard"; // import the welcome card component
import { useState, useEffect } from "react"; // import useState and useEffect hooks from React
import { Outlet } from "react-router-dom"; // import Outlet from react-router-dom
import RequestCards from "../components/studentcomponents/RequestCards"; // import the RequestCards component
import { useAuthUser } from "react-auth-kit";
import { useAuthHeader } from "react-auth-kit";
import axios from '../services/axios'
import SendApplicationCard from "../components/studentcomponents/SendApplicationCard"; // import the SendApplicationCard component
import LetterRequestTable from "../components/studentcomponents/LetterRequestTable";
import ApplicationRequestTable from "../components/studentcomponents/ApplicationRequestTable";

const StudentDashboard = () => {
  // initialize the state variables using the useState hook
  // sample data for the CustomTable component
  const auth = useAuthUser();
  const authHeader = useAuthHeader();
  const [userInfo, setUserInfo] = useState({
    id: "",
    firstName: "",
    lastName: "",
    phoneNum: "",
    role: "",
  });
  const [studentInfo, setStudentInfo] = useState({
    id: "",
    studentNumber: "",
    department: {
      id: "",
      name: "",
    },
  });
  const [coordinatorInfo, setCoordinatorInfo] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [letterReq , setLetterReq] = useState([{}]);
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const { email } = auth() || {};
        // Simulate loading by adding a delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        const response = await axios.get('/student/' +email, {
          headers: {
            authorization: authHeader(),
          },
        });

        const { user, student, coordinator } = response.data;
        setUserInfo(user);
        setStudentInfo(student);
        setCoordinatorInfo(coordinator); // Set the coordinator information

        setIsLoading(false);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchUserInfo();
    
   
  }, []);
  useEffect(() => {
    document.title = "InternHUB - Dashboard";
    
  }, []);
 

  if (isLoading) {
    return (
      <div className="loading-spinner">
      <h3>Loading Student Dashboard <span className="ellipsis"></span></h3>
        <div className="progress-bar">
          <div className="progress"></div>
        </div>
      </div>
    );
  }
  return (
    <div className="container">
      {/* NAVEBAR */}
      <SideNavbar
        links={[
          { label: "Dashboard", to: "/dashboard", icon: "bxs-grid-alt" },
          { label: "Messages", to: "/messages", icon: "bxs-envelope" },
          { label: "Internships", to: "/internships", icon: "bxs-user" },
          { label: "Settings", to: "/settings", icon: "bxs-cog" },
        ]}
        name={userInfo.firstName + " " + userInfo.lastName}
        role={userInfo.role}
      />

      <div className="main-content main-dashboard">
        {/* this is the div containing the main content of the page */}
        {/* header */}
        <Header title="Dashboard" />
        {/* welcome card */}
        <WelcomeCard
          recipient={userInfo.firstName + " " + userInfo.lastName}
          message="You're now logged in to your account and ready to get started.  From your dashboard, you can Submit your application, Receive your approvals, submit requests, and access all of our features and resources."
        />

        <div className="request-cards-row">
          <RequestCards
            numButtons={2}
            buttonLabels={["Application", "Report"]}
            content={
              <>
                <p>
                  Uskuadar University <br />
                  Internship forms
                </p>
              </>
            }
          />
          <SendApplicationCard
            numButtons={1}
            buttonLabels={["Send"]}
            studentId={studentInfo.id}
            coordinatorId={coordinatorInfo.id}
            content={
              <>
                <p>Submit Internship Application Documents </p>
              </>
            }
          />
          <RequestCards
            numButtons={1}
            buttonLabels={["Request"]}
            studentId={studentInfo.id}
            coordinatorId={coordinatorInfo.id}
            content={
              <>
                <p>
                  Request official Letter from Coordinator:{" "}
                  <span className="bold">{coordinatorInfo.firstName + " " + coordinatorInfo.lastName}</span>{" "}
                </p>
              </>
            }
          />
        </div>

        {/*  letter request table*/}
        <div className="table-container">
          <LetterRequestTable studentId={studentInfo.id} />
        </div>
        {/*  application request table*/}
        <div className="table-container ">
         <ApplicationRequestTable studentId={studentInfo.id}/>
         </div>



      </div>
      <Outlet />
    </div>
  );
};

export default StudentDashboard;
