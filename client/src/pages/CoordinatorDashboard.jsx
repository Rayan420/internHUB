import SideNavbar from "../components/NavBar";
import Header from "../components/Header";
import WelcomeCard from "../components/WelcomeCard";
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAuthUser } from "react-auth-kit";
import { useAuthHeader } from "react-auth-kit";
import axios from "../services/axios";
import RequestViewer from "../components/coordinatorcomponents/RequestViewer";
import UploadInternFiles from "../components/coordinatorcomponents/UploadInternFiles";
import NotificationModal from "../components/Notification";

const CoordinatorDashboard = () => {
  const auth = useAuthUser();
  const authHeader = useAuthHeader();
  const [coordinator, setCoordinator] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };
  const [notifications, setNotifications] = useState([]);

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
         // Fetch user notifications
         const notificationsResponse = await axios.get(`/notification/${data.user.id}`, {
          headers: {
            authorization: authHeader(),
          },
        });
        setNotifications(notificationsResponse.data.notifications);
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

  // Callback function to update notifications when marked as read
  const handleNotificationRead = (notificationId) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) => {
        if (notification.id === notificationId) {
          return { ...notification, read: true };
        }
        return notification;
      })
    );
  };



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

  console.log("the coordinator id: ", coordinator.coordinator.id)
const coordinatorId = coordinator.coordinator.id
  return (
    <div className="container">
      {/* NAVBAR */}
      <SideNavbar
        links={[
          { label: "Dashboard", to: "/dashboard", icon: "bxs-grid-alt" },
          { label: "Messages", to: "/messages", icon: "bxs-envelope" },
          { label: "Applications", to: "/applications", icon: "bxs-edit" },
          { label: "Settings", to: "/settings", icon: "bxs-cog" },
        ]}
        name={coordinator.user.firstName + " " +coordinator.user.lastName}
        role={auth().role}
        notificationPlaceholder={
          <div className="an notification" onClick={toggleNotification}>
            <i className="bx bxs-bell"></i>
            <span className="nav-item">Notifications</span>
            {notifications.filter((notification) => !notification.read).length > 0 && (
              <div className="unread-count">
                {notifications.filter((notification) => !notification.read).length}
              </div>
            )}
          </div>
        }
      />

      <div className="main-content main-dashboard">
        {/* this is the div containing the main content of the page */}
        {/* header */}
        <Header title="Dashboard" />
        {/* welcome card */}
        <WelcomeCard
          recipient={coordinator.user.firstName + " " +coordinator.user.lastName}
          message="You're now logged in to your account and ready to get started. From your dashboard, access your student's Internship requests, generate letters on request, and access all of our features and resources."
        />
       
       <div  className="request-cards-row coordinator-send-forms">
          <UploadInternFiles 
              coordinatorId={coordinator.coordinator.id}
              numButtons={1}
              buttonLabels={["Send"]}
              content={
                <p>
                  Upload your student's internship application form files here. 
                </p>
              }
            />
       </div>
       
        
        {/* Request Viewer */}
        <RequestViewer coordinatorId={coordinatorId} />
        
        {isNotificationOpen && 
         <NotificationModal
         onClose={toggleNotification}
         notifications={notifications.filter((notification) => !notification.read)}
         onNotificationRead={handleNotificationRead}
         userId={coordinator.user.id}
       />
      }
      </div>

      <Outlet />
    </div>
  );
};

export default CoordinatorDashboard;
