import SideNavbar from '../components/admincomponents/NavBar';
import Header from '../components/admincomponents/Header';
import WelcomeCard from '../components/admincomponents/WelcomeCard';
import InfoCard from '../components/admincomponents/InfoCard';
import student from '../assets/student-female-svgrepo-com.svg'
import prof from '../assets/reshot-icon-female-professor.svg'
import center from '../assets/building-dome-svgrepo-com.svg'
import form from '../assets/advanced-study-application-svgrepo-com.svg'
import ApplicationSummary from '../components/admincomponents/ApplicationSummary';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';

const AdminDashboard = () => {
  const [active, setActive] = useState('dashboard');

  function changeTitle() {
    document.title = "InternHUB - Admin";
  } 

  
  return (
    <div className="container">
      {/* NAVEBAR */}
        <SideNavbar history={history} />

      <div className='main-content main-dashboard'>
        {/* this is the div containing the main content of the page */}
         {/* header */}
        <Header />
        {/* welcome card */}
        <WelcomeCard />
        {/* info cards */}
        <div className='info-cards'>
          <InfoCard title='Total Students' value='100' icon={student} backgroundColor={'#023047'} backgroundColorSecond={'#26308C'}/>
          <InfoCard title='Total Coordinators' value='100' icon={prof} backgroundColor={"#DA722C"} backgroundColorSecond={'#A65119'}/>
          <InfoCard title='Total Centers' value='100' icon={center} backgroundColor={'#5B2B9A'} backgroundColorSecond={'#9747FF'}/>
          <InfoCard title='Total Applications' value='100' icon={form} backgroundColor={'#21608A'} backgroundColorSecond={'#2AA4F4'}/>
        </div>
        {/* paginated list of student applications summary */}
           <ApplicationSummary />   

      </div>
      <Outlet />
    </div>
  );
};

export default AdminDashboard;