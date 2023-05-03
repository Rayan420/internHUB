import logo from '../../assets/logo.png';
import { useEffect } from 'react';
import SideNavbar from '../../components/admincomponents/NavBar';
const AdminDashboard = () => {
  function changeTitle() {
    document.title = "InternHUB - Admin";
  } 

  useEffect(() => {
    changeTitle();
  }, []);
  return (
    <div className="container">
      {/* header */}

      {/* NAVEBAR */}
      <SideNavbar />
      
      
    </div>
  );
};

export default AdminDashboard;