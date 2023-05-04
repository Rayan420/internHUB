import { useEffect } from 'react';
import SideNavbar from '../../components/admincomponents/NavBar';
import Header from '../../components/admincomponents/Header';



const AdminDashboard = () => {

  function changeTitle() {
    document.title = "InternHUB - Admin";
  } 

  useEffect(() => {
    changeTitle();
  }, []);

  return (
    <div className="container">
      {/* NAVEBAR */}
        <SideNavbar  />
      <div className='main-content'>
        {/* this is the div containing the main content of the page */}
         {/* header */}
        <Header />


      </div>
  
    </div>
  );
};

export default AdminDashboard;