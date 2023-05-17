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


const Users = () => {

  const auth = useAuthUser();
  const authHeader = useAuthHeader();
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const handleTabChange = (index) => {
    setActiveTabIndex(index);
  };
  
  useEffect(() => {
    console.log("Fetching user data");
    console.log(authHeader());
    const fetchUserData = async () => {
      try {
        const { email } = auth() || {};
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
        if (error.response === 401 || error.response === 403) {
          signout();
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);
    useEffect(() => async () =>{
        document.title = "InternHUB - Users";
        

        }, []);
        if (isLoading) {
          return (
            <div className="loading-spinner">
            <h3>Getting users <span className="ellipsis"></span></h3>
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
          { label: 'Dashboard', to: '/dashboard', icon: 'bxs-grid-alt' },
          { label: 'Messages', to: '/messages', icon: 'bxs-envelope' },
          { label: 'Users', to: '/users', icon: 'bxs-user' }, 
          { label: 'Settings', to: '/settings', icon: 'bxs-cog' }  
          ]} name={user.firstName + ' ' + user.lastName} role={auth().role}/>
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
   
      </div>
      <Outlet />
    </div>
    )
}

export default Users