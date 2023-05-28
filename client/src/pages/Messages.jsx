import {useState, useEffect} from 'react';
import MessagePageHeader from "../components/messagecomponents/MessagePageHeader";
import SideNavbar from "../components/NavBar";
import Inbox from "../components/messagecomponents/Inbox";
import ComposeModal from "../components/messagecomponents/Compose";
import { useAuthUser } from "react-auth-kit";
import { useAuthHeader } from "react-auth-kit";
import axios from '../services/axios';
import NotificationModal from "../components/Notification";

const Messages = () => {
  const [showModal, setShowModal] = useState(false);
  
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };
  const authHeader = useAuthHeader();
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

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
        setUser(data);
        console.log(data);
        console.log("auth header:", authHeader());
         // Fetch user notifications
         const notificationsResponse = await axios.get(`/notification/${data.id}`, {
          headers: {
            authorization: authHeader(),
          },
        });
        setNotifications(notificationsResponse.data.notifications);
      } catch (error) {
        console.log(error);
        if (error.response.status === 401 || error.response.status === 403) {
          signout();
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);
  const auth = useAuthUser();
  let navLinks = [];
  
  if (auth().role === "Student") {
    navLinks = [
      { label: "Dashboard", to: "/dashboard", icon: "bxs-grid-alt" },
      { label: "Messages", to: "/messages", icon: "bxs-envelope" },
      { label: "Internships", to: "/internships", icon: "bxs-briefcase" },
      { label: "Settings", to: "/settings", icon: "bxs-cog" },
    ];
  } else if (auth().role === "Admin") {
    navLinks = [
      { label: "Dashboard", to: "/dashboard", icon: "bxs-grid-alt" },
      { label: "Messages", to: "/messages", icon: "bxs-envelope" },
      { label: "Users", to: "/users", icon: "bxs-user" },
      { label: "Settings", to: "/settings", icon: "bxs-cog" },
    ];
  } else if (auth().role === "Coordinator") {
    navLinks = [
      { label: "Dashboard", to: "/dashboard", icon: "bxs-grid-alt" },
      { label: "Messages", to: "/messages", icon: "bxs-envelope" },
      { label: "Applications", to: "/applications", icon: "bxs-edit" },
      { label: "Settings", to: "/settings", icon: "bxs-cog" },
    ];
  }
  else if (auth().role === "Careercenter") {
    navLinks = [
      { label: "Dashboard", to: "/dashboard", icon: "bxs-grid-alt" },
      { label: "Messages", to: "/messages", icon: "bxs-envelope" },
      { label: "Jobs", to: "/jobs", icon: "bxs-briefcase" },
      { label: "Settings", to: "/settings", icon: "bxs-cog" },
    ];
  }
  
  useEffect(() => {
    document.title = "InternHUB - Messages";

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
      <SideNavbar
        links={navLinks}
        name={user.firstName + " " + user.lastName}
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
      <div className="main-content main-message">
        <MessagePageHeader setShowModal={setShowModal} />
        <Inbox  userId={user.id}/>
        <ComposeModal showModal={showModal} setShowModal={setShowModal}  userId={user.id} />
        {isNotificationOpen && 
         <NotificationModal
         onClose={toggleNotification}
         notifications={notifications.filter((notification) => !notification.read)}
         onNotificationRead={handleNotificationRead}
         userId={user.id}
       />
      }
      </div>
      
    </div>
  );
};

export default Messages;
