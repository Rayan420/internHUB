import SideNavbar from "../components/NavBar"
import Header from "../components/Header"
import {useState, useEffect} from 'react';
import { Outlet } from "react-router-dom"
import { useAuthUser } from "react-auth-kit";
import { useAuthHeader } from "react-auth-kit";
import axios from "../services/axios";
import AddNewUser from "../components/usercomponents/AddNewUser";
import CreateDepartment from "../components/usercomponents/CreateDepartment";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import NotificationModal from "../components/Notification";

const Users = () => {

  const auth = useAuthUser();
  const authHeader = useAuthHeader();
  const [user, setUser] = useState({});
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
    console.log("Fetching user data");
    console.log(authHeader());
    const fetchUserData = async () => {
      try {
        const { email } = auth() || {};
        const { data } = await axios.get("/users/" + email, {
          headers: {
            authorization: authHeader(),
          },
        });
        // Fetch user notifications
         const notificationsResponse = await axios.get(`/notification/${data.id}`, {
          headers: {
            authorization: authHeader(),
          },
        });
        setNotifications(notificationsResponse.data.notifications);
        setUser(data);
        console.log(data);
        console.log("auth header:", authHeader());
      } catch (error) {
        console.log(error);
        if (error.response === 401 || error.response === 403) {
          signout();
        }
      } 
    };
    fetchUserData();
  }, []);
    useEffect(() => async () =>{
        document.title = "InternHUB - Users";
        

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

    return (
        <div className="container">
      {/* NAVEBAR */}
      <SideNavbar
        links={[
          { label: 'Dashboard', to: '/dashboard', icon: 'bxs-grid-alt' },
          { label: 'Messages', to: '/messages', icon: 'bxs-envelope' },
          { label: 'Users', to: '/users', icon: 'bxs-user' }, 
          { label: 'Settings', to: '/settings', icon: 'bxs-cog' }  
          ]} 
          name={user.firstName + ' ' + user.lastName}
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
          {/* this is the div containing the main content of the page */}      
          <div className='main-content main-dashboard'>
        
         {/* header */}
        <Header title="Users" />
        <Tabs selectedIndex={activeTabIndex} onSelect={handleTabChange}>
              <TabList className="tabslist user-page-tabslist">
                <Tab className="tab" selectedClassName="tab--selected">Create Users</Tab>
                <Tab className="tab" selectedClassName="tab--selected">Create Department</Tab>
              </TabList>
              
              <TabPanel>
                <AddNewUser />
              </TabPanel>
              <TabPanel>
                <CreateDepartment />
              </TabPanel>
             
      </Tabs>
      {isNotificationOpen && 
         <NotificationModal
         onClose={toggleNotification}
         notifications={notifications.filter((notification) => !notification.read)}
         onNotificationRead={handleNotificationRead}
         userId={user.id}
       />
      }
   
      </div>
      <Outlet />
    </div>
    )
}

export default Users