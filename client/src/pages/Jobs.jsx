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
const Jobs = () => {
  // initialize the state variables using the useState hook
  // sample data for the CustomTable component
  const auth = useAuthUser();
  const authHeader = useAuthHeader();
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
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
      

      </div>
      <Outlet />
    </div>
  );
};

export default Jobs;
