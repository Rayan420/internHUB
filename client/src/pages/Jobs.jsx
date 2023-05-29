import SideNavbar from "../components/NavBar"; // import the side navbar component
import Header from "../components/Header"; // import the header component
import { useState, useEffect } from "react"; // import useState and useEffect hooks from React
import { Outlet } from "react-router-dom"; // import Outlet from react-router-dom
import { useAuthUser } from "react-auth-kit";
import { useAuthHeader } from "react-auth-kit";
import axios from '../services/axios'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import CreateInternshipOpportunity from "../components/careercentercomponents/CreateInternshipOpportunity";
import OpportunitiesComponent from "../components/careercentercomponents/OpportunitiesComponent";
import NotificationModal from "../components/Notification";

const Jobs = () => {
  // initialize the state variables using the useState hook
  // sample data for the CustomTable component
  const auth = useAuthUser();
  const authHeader = useAuthHeader();
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };
  const [notifications, setNotifications] = useState([]);

  const handleTabChange = (index) => {
    setActiveTabIndex(index);
  };


  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const { email } = auth() || {};
        // Simulate loading by adding a delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        const response = await axios.get('/careercenter/' +email, {
          headers: {
            authorization: authHeader(),
          },
        });

        const {user} = response.data;
       // Fetch user notifications
         const notificationsResponse = await axios.get(`/notification/${user.id}`, {
          headers: {
            authorization: authHeader(),
          },
        });
        setNotifications(notificationsResponse.data.notifications);
        console.log(response.data);
        setUserInfo(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchUserInfo();
    
   
  }, []);
  useEffect(() => {
    document.title = "InternHUB - jobs";
    
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
      <h3>Loading Student Jobs <span className="ellipsis"></span></h3>
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
            { label: "Jobs", to: "/jobs", icon: "bxs-briefcase" },
            { label: "Settings", to: "/settings", icon: "bxs-cog" },
          ]}
        name={userInfo.user.firstName + " " + userInfo.user.lastName}
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
        <Header title="Jobs" />
        <Tabs selectedIndex={activeTabIndex} onSelect={handleTabChange}>
              <TabList className="tabslist user-page-tabslist">
                <Tab className="tab" selectedClassName="tab--selected">View Jobs</Tab>
                <Tab className="tab" selectedClassName="tab--selected">Add Job</Tab>
              </TabList>
              <TabPanel>
                <OpportunitiesComponent careerCenterId={userInfo.careerCenter.id} />
              </TabPanel>
              <TabPanel>
                <CreateInternshipOpportunity careerCenterId={userInfo.careerCenter.id} />
              </TabPanel>
             
      </Tabs>
      
      {isNotificationOpen && 
         <NotificationModal
         onClose={toggleNotification}
         notifications={notifications.filter((notification) => !notification.read)}
         onNotificationRead={handleNotificationRead}
         userId={userInfo.user.id}
       />
      }
      </div>
      <Outlet />
    </div>
  );
};

export default Jobs;
