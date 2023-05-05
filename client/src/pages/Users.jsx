import SideNavbar from "../components/NavBar"
import Header from "../components/Header"
import { useEffect } from "react"
import { Outlet } from "react-router-dom"

const Users = () => {
    useEffect(() => {
        document.title = "InternHUB - Users";

        }, []);
    return (
        <div className="container">
      {/* NAVEBAR */}
      <SideNavbar
        links={[
          { label: 'Dashboard', to: '/dashboard', icon: 'bxs-grid-alt' },
          { label: 'Messages', to: '/messages', icon: 'bxs-envelope' },
          { label: 'Users', to: '/users', icon: 'bxs-user' }, 
          { label: 'Settings', to: '/settings', icon: 'bxs-cog' }  
          ]} name={"Ahmed Rayan"} role={"Admin"}/>      <div className='main-content main-dashboard'>
        {/* this is the div containing the main content of the page */}
         {/* header */}
        <Header title="Users" />
        
      </div>
      <Outlet />
    </div>
    )
}

export default Users