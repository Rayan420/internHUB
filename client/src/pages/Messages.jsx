import {useState, useEffect} from 'react';
import MessagePageHeader from "../components/messagecomponents/MessagePageHeader";
import SideNavbar from "../components/NavBar";
import Inbox from "../components/messagecomponents/Inbox";
import ComposeModal from "../components/messagecomponents/Compose";
import { useAuthUser } from "react-auth-kit";
import { useAuthHeader } from "react-auth-kit";
import axios from '../services/axios';

const Messages = () => {
  const [showModal, setShowModal] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "John Doe",
      time: "10:30 AM",
      title: "Meeting Reminder",
      content: "Don't forget our meeting at 11:00 AM today.",
      read: false,
    },
    {
      id: 2,
      sender: "Jane Smith",
      time: "Yesterday",
      title: "Vacation plans",
      content:
        "Hi, just wanted to let you know that I'm planning a vacation next month and I would like to know if you want to join me.",
      read: true,
    },
    {
      id: 3,
      sender: "Mark Johnson",
      time: "2 days ago",
      title: "Project Update",
      content:
        "Hello, I just wanted to give you a quick update on the project we're working on. We're making good progress and everything is going according to plan.",
      read: true,
    },
  ]);
  const authHeader = useAuthHeader();
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);

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
      { label: "Internships", to: "/internships", icon: "bxs-user" },
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
      { label: "Applications", to: "/applications", icon: "bxs-user" },
      { label: "Settings", to: "/settings", icon: "bxs-cog" },
    ];
  }
  else if (auth().role === "Careercenter") {
    navLinks = [
      { label: "Dashboard", to: "/dashboard", icon: "bxs-grid-alt" },
      { label: "Messages", to: "/messages", icon: "bxs-envelope" },
      { label: "Jobs", to: "/jobs", icon: "bxs-user" },
      { label: "Settings", to: "/settings", icon: "bxs-cog" },
    ];
  }
  
  useEffect(() => {
    document.title = "InternHUB - Messages";

    }, []);


  return (
    <div className="container">
      <SideNavbar
        links={navLinks}
        name={user.firstName + " " + user.lastName}
        role={auth().role}
      />
      <div className="main-content main-message">
        <MessagePageHeader setShowModal={setShowModal} />
        <Inbox messages={messages} messageCount={messages.length} />
        <ComposeModal showModal={showModal} setShowModal={setShowModal} />
      </div>
    </div>
  );
};

export default Messages;
