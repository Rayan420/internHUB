import MessagePageHeader from "../components/messagecomponents/MessagePageHeader";
import SideNavbar from "../components/NavBar";
import Inbox from "../components/messagecomponents/Inbox";
import { useState } from "react";
import ComposeModal from "../components/messagecomponents/Compose";
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

  return (
    <div className="container">
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
      <div className="main-content main-message">
        <MessagePageHeader setShowModal={setShowModal} />
        <Inbox messages={messages} messageCount={messages.length} />
        <ComposeModal showModal={showModal} setShowModal={setShowModal} />
      </div>
    </div>
  );
};

export default Messages;
