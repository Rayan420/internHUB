import { useEffect, useState } from "react";
import SideNavbar from "../components/NavBar";
import Header from "../components/Header";
import InternshipPage from "../components/internship/InternshipPage";
import { useAuthUser, useAuthHeader } from "react-auth-kit";
import axios from "../services/axios";
import NotificationModal from "../components/Notification";

const Internships = () => {
  const [internships, setInternships] = useState([]);
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
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const { email } = auth() || {};
        // Simulate loading by adding a delay
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const response = await axios.get("/student/" + email, {
          headers: {
            authorization: authHeader(),
          },
        });

        const { user, student, coordinator } = response.data;
        setUserInfo(user);
        setStudentInfo(student);
        setCoordinatorInfo(coordinator); // Set the coordinator information

        const department = student.department?.name || ""; // Access department name safely
         // Fetch user notifications
         const notificationsResponse = await axios.get(`/notification/${user.id}`, {
          headers: {
            authorization: authHeader(),
          },
        });
        setNotifications(notificationsResponse.data.notifications);
        // Make an Axios GET request to fetch internships based on user's department
        console.log("department:", department )
        axios
          .get("/internships/" + department, {
            headers: {
              authorization: authHeader(),
            },
          })
          .then((response) => {
            setInternships(response.data);
          })
          .catch((error) => {
            console.error("Error fetching internships:", error);
          });
      } catch (error) {
        console.error("Error:", error);
      }
      setIsLoading(false);
    };

    fetchUserInfo();
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

  useEffect(() => {
    document.title = "InternHUB - Opportunities";
  }, []);

  if (isLoading) {
    return (
      <div className="loading-spinner">
        <h3>Getting internships<span className="ellipsis"></span></h3>
        <div className="progress-bar">
          <div className="progress"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <SideNavbar
        links={[
          { label: "Dashboard", to: "/dashboard", icon: "bxs-grid-alt" },
          { label: "Messages", to: "/messages", icon: "bxs-envelope" },
          { label: "Internships", to: "/internships", icon: "bxs-briefcase" },
          { label: "Settings", to: "/settings", icon: "bxs-cog" },
        ]}
        name={"Ahmed Rayan"}
        role={"Student"}
        id={"200209393"}
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
        <Header title="Internships" />

        <InternshipPage internships={internships} />

        {isNotificationOpen && 
         <NotificationModal
         onClose={toggleNotification}
         notifications={notifications.filter((notification) => !notification.read)}
         onNotificationRead={handleNotificationRead}
         userId={userInfo.id}
       />
      }
      </div>
    </div>
  );
};

export default Internships;
