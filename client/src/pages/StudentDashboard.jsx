import SideNavbar from "../components/NavBar"; // import the side navbar component
import Header from "../components/Header"; // import the header component
import WelcomeCard from "../components/WelcomeCard"; // import the welcome card component
import { useState, useEffect } from "react"; // import useState and useEffect hooks from React
import { Outlet } from "react-router-dom"; // import Outlet from react-router-dom
import RequestCards from "../components/studentcomponents/RequestCards"; // import the RequestCards component
import CustomTable from "../components/Table"; // import the CustomTable component

const StudentDashboard = () => {
  // initialize the state variables using the useState hook
  const coordinator = "Dr. Ahmed Elsayed";
  // sample data for the CustomTable component

  useEffect(() => {
    document.title = "InternHUB - Dashboard";
  }, []);

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
        name={"Ahmed Rayan"}
        role={"Student"}
        id={"200209393"}
      />

      <div className="main-content main-dashboard">
        {/* this is the div containing the main content of the page */}
        {/* header */}
        <Header title="Dashboard" />
        {/* welcome card */}
        <WelcomeCard
          recipient="Ahmed Rayan"
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
          <RequestCards
            numButtons={1}
            buttonLabels={["Send"]}
            content={
              <>
                <p>Submit Internship Application Documents </p>
              </>
            }
          />
          <RequestCards
            numButtons={1}
            buttonLabels={["Request"]}
            content={
              <>
                <p>
                  Request official Letter from Coordinator:{" "}
                  <span id="userID">{coordinator}</span>{" "}
                </p>
              </>
            }
          />
        </div>

        <div className="table-container">
          <h2 className="aaps-title">Letter Requests</h2>
          <CustomTable
            columns={["Request Number", "Date of Submission", "Status"]}
            data={[]}
            numButtons={1}
            buttonLabels={["Download"]}
            noDataMessage="You have not requested any letters yet."
            isDisabled={false}
            disableButtonCondition={true}
          />
        </div>

        <div className="table-container-2">
          <h2 className="aaps-title">Applications</h2>
          <CustomTable
            columns={["Application Number", "Date of Submission", "Status"]}
            data={[]}
            numButtons={1}
            buttonLabels={["Download"]}
            noDataMessage="You do not have any applications yet."
            isDisabled={false}
            disableButtonCondition={true}
          />
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default StudentDashboard;
