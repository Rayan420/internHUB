import {useState, useEffect} from 'react';
import SideNavbar from "../components/NavBar";
import Header from "../components/Header";
import WelcomeCard from "../components/WelcomeCard";
import InfoCard from "../components/admincomponents/InfoCard";
import student from "../assets/student-female-svgrepo-com.svg";
import prof from "../assets/reshot-icon-female-professor.svg";
import center from "../assets/building-dome-svgrepo-com.svg";
import form from "../assets/advanced-study-application-svgrepo-com.svg";
import ApplicationSummary from "../components/admincomponents/ApplicationSummary";
import axios from "../services/axios";
import { useAuthUser } from "react-auth-kit";
import { useAuthHeader } from "react-auth-kit";
import { useSignOut } from "react-auth-kit";

const AdminDashboard = () => {
  const signout = useSignOut();
  const auth = useAuthUser();
  const authHeader = useAuthHeader();
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("Fetching user data");
    console.log(authHeader());
    const fetchUserData = async () => {
      try {
        const { email } = auth() || {};
        // Simulate loading by adding a delay
        await new Promise(resolve => setTimeout(resolve, 2000));
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
  useEffect(() => {
    document.title = "InternHUB - Dashboard";

    }, []);

    if (isLoading) {
      return (
        <div className="loading-spinner">
        <h3>Loading Admin Dashboard <span className="ellipsis"></span></h3>
          <div className="progress-bar">
            <div className="progress"></div>
          </div>
        </div>
      );
    }

  return(  
    <div className="container">
      {/* NAVEBAR */}
      <SideNavbar
        links={[
          { label: "Dashboard", to: "/dashboard", icon: "bxs-grid-alt" },
          { label: "Messages", to: "/messages", icon: "bxs-envelope" },
          { label: "Users", to: "/users", icon: "bxs-user" },
          { label: "Settings", to: "/settings", icon: "bxs-cog" },
        ]}
        name={user.firstName + " " + user.lastName}
        role={auth().role}
      />

      <div className="main-content main-dashboard">
        {/* this is the div containing the main content of the page */}
        {/* header */}
        <Header title="Dashboard" />
        {/* welcome card */}
        <WelcomeCard
          recipient={user.firstName + " " + user.lastName}
          message="You're now logged in to your account and ready to get started.  From your dashboard, you can manage your profile, view your account information, and access all of our features and resources."
        />

        {/* info cards */}
        <div className="info-cards">
          <InfoCard
            title="Total Students"
            value="100"
            icon={student}
            backgroundColor={"#023047"}
            backgroundColorSecond={"#26308C"}
          />
          <InfoCard
            title="Total Coordinators"
            value="100"
            icon={prof}
            backgroundColor={"#DA722C"}
            backgroundColorSecond={"#A65119"}
          />
          <InfoCard
            title="Total Centers"
            value="100"
            icon={center}
            backgroundColor={"#5B2B9A"}
            backgroundColorSecond={"#9747FF"}
          />
          <InfoCard
            title="Total Applications"
            value="100"
            icon={form}
            backgroundColor={"#21608A"}
            backgroundColorSecond={"#2AA4F4"}
          />
        </div>

        {/* paginated list of student applications summary */}
        <ApplicationSummary data={[]} />
      </div>
    </div>);
};

export default AdminDashboard;
