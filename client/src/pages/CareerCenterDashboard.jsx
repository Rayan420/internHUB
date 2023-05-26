
import SideNavbar from "../components/NavBar"; // import the side navbar component
import Header from "../components/Header"; // import the header component
import WelcomeCard from "../components/WelcomeCard"; // import the welcome card component
import { useState, useEffect } from "react"; // import useState and useEffect hooks from React
import { Outlet } from "react-router-dom"; // import Outlet from react-router-dom
import { useAuthUser } from "react-auth-kit";
import { useAuthHeader } from "react-auth-kit";
import axios from "../services/axios";
import SGKRequests from "../components/careercentercomponents/SGKRequests";
const CareerCenterDashboard = () => {
  // initialize the state variables using the useState hook
  // sample data for the CustomTable component
  const auth = useAuthUser();
  const authHeader = useAuthHeader();
  const [user, setUser] = useState({});
  const [careercenter, setCareerCenter] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("Fetching user data");
    console.log(authHeader());
    const fetchUserData = async () => {
      try {
        const { email } = auth() || {};
        console.log(email);
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
        if (error.response.status === 400 || error.response.status === 500) {
          signout();
        }
      } finally {
        const { email } = auth() || {};
        const { data } = await axios.get("/careercenter/" + email, {
          headers: {
            authorization: authHeader(),
          },
        });
        setCareerCenter(data);
        setIsLoading(false);
        console.log(user)
      }
    };
    fetchUserData();
  }, []);
  useEffect(() => {
    document.title = "InternHUB - Dashboard";
    
  }, []);
 
  console.log("user",user);
  console.log("careercenter",careercenter.id);
  if (isLoading) {
    return (
      <div className="loading-spinner">
      <h3>Loading Center Dashboard <span className="ellipsis"></span></h3>
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
          { label: "Jobs", to: "/internships", icon: "bxs-briefcase" },
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
          message="You're now logged in to your account and ready to get started.  From your dashboard, you can post Internship Listings, deliver SGK requests, and access all of our features and resources."
        />

        {/* SGK Requests */}
        <SGKRequests careerCenterId={careercenter.careerCenter} />
      </div>
      <Outlet />
    </div>
  );
};

export default CareerCenterDashboard;
