import SideNavbar from "../components/admincomponents/NavBar"
import Header from "../components/admincomponents/Header"
import { useEffect } from "react"
import { Outlet } from "react-router-dom"

const Users = () => {
    useEffect(() => {
        document.title = "InternHUB - Users";

        }, []);
    return (
        <div className="container">
      {/* NAVEBAR */}
        <SideNavbar  />
      <div className='main-content main-dashboard'>
        {/* this is the div containing the main content of the page */}
         {/* header */}
        <Header />
        
      </div>
      <Outlet />
    </div>
    )
}

export default Users