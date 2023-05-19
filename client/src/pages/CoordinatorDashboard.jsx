import SideNavbar from "../components/NavBar";
import Header from "../components/Header";
import WelcomeCard from "../components/WelcomeCard";
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAuthUser } from "react-auth-kit";
import { useAuthHeader } from "react-auth-kit";
import axios from "../services/axios";
import RequestViewer from "../components/coordinatorcomponents/RequestViewer";

const CoordinatorDashboard = () => {
  const auth = useAuthUser();
  const authHeader = useAuthHeader();
  const [coordinator, setCoordinator] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("Fetching coordinator data");
    const fetchCoordinatorData = async () => {
      try {
        const { email } = auth() || {};
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const { data } = await axios.get("/coordinator/" + email, {
          headers: {
            authorization: authHeader(),
          },
        });
        setCoordinator(data);
        console.log(data);
      } catch (error) {
        console.log(error);
        if (error.response.status === 400 || error.response.status === 500) {
          // Handle error
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchCoordinatorData();
  }, []);

  console.log(coordinator);
  useEffect(() => {
    document.title = "InternHUB - Dashboard";
  }, []);

  if (isLoading) {
    return (
      <div className="loading-spinner">
        <h3>Loading Coordinator Dashboard</h3>
        <div className="progress-bar">
          <div className="progress"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* NAVBAR */}
      <SideNavbar
        links={[
          { label: "Dashboard", to: "/dashboard", icon: "bxs-grid-alt" },
          { label: "Messages", to: "/messages", icon: "bxs-envelope" },
          { label: "Applications", to: "/applications", icon: "bxs-briefcase" },
          { label: "Settings", to: "/settings", icon: "bxs-cog" },
        ]}
        name={coordinator.user.firstName + " " +coordinator.user.lastName}
        role={auth().role}
      />

      <div className="main-content main-dashboard">
        {/* this is the div containing the main content of the page */}
        {/* header */}
        <Header title="Dashboard" />
        {/* welcome card */}
        <WelcomeCard
          recipient={coordinator.firstName + " " + coordinator.lastName}
          message="You're now logged in to your account and ready to get started. From your dashboard, access your student's Internship requests, generate letters on request, and access all of our features and resources."
        />
        
        {/* Request Viewer */}
        <RequestViewer coordinatorId={coordinator.id} />
      </div>
      <Outlet />
    </div>
  );
};

export default CoordinatorDashboard;
