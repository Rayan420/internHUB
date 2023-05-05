import SideNavbar from '../components/NavBar';
import Header from '../components/Header';
import WelcomeCard from '../components/WelcomeCard';
import InfoCard from '../components/admincomponents/InfoCard';
import student from '../assets/student-female-svgrepo-com.svg'
import prof from '../assets/reshot-icon-female-professor.svg'
import center from '../assets/building-dome-svgrepo-com.svg'
import form from '../assets/advanced-study-application-svgrepo-com.svg'
import ApplicationSummary from '../components/admincomponents/ApplicationSummary';
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';


const AdminDashboard = () => {
  const [data, setData] = useState([
    { id: 1, studentId: 6000, student: 'dom', department: 'software', coordinator: 'jane', appId: 6000, status: 'approved' },
    { id: 2, studentId: 6001, student: 'john', department: 'engineering', coordinator: 'jane', appId: 6001, status: 'rejected' },
    { id: 3, studentId: 6002, student: 'mary', department: 'science', coordinator: 'john', appId: 6002, status: 'approved' },
    { id: 4, studentId: 6003, student: 'peter', department: 'mathematics', coordinator: 'jane', appId: 6003, status: 'pending' },
    { id: 5, studentId: 6004, student: 'susan', department: 'law', coordinator: 'john', appId: 6004, status: 'approved' },
    { id: 6, studentId: 6005, student: 'joe', department: 'medicine', coordinator: 'jane', appId: 6005, status: 'rejected' },
    { id: 7, studentId: 6006, student: 'anna', department: 'business', coordinator: 'john', appId: 6006, status: 'approved' },
  ]);
  useEffect(() => {
    document.title = "InternHUB - Dashboard";

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
          ]} name={"Ahmed Rayan"} role={"Admin"}/>


      <div className='main-content main-dashboard'>
        {/* this is the div containing the main content of the page */}
         {/* header */}
        <Header title="Dashboard"/>
        {/* welcome card */}
        <WelcomeCard recipient='Ahmed Rayan' message="You're now logged in to your account and ready to get started.  From your dashboard, you can manage your profile, view your account information, and access all of our features and resources." />
        
        {/* info cards */}
        <div className='info-cards'>
          <InfoCard title='Total Students' value='100' icon={student} backgroundColor={'#023047'} backgroundColorSecond={'#26308C'}/>
          <InfoCard title='Total Coordinators' value='100' icon={prof} backgroundColor={"#DA722C"} backgroundColorSecond={'#A65119'}/>
          <InfoCard title='Total Centers' value='100' icon={center} backgroundColor={'#5B2B9A'} backgroundColorSecond={'#9747FF'}/>
          <InfoCard title='Total Applications' value='100' icon={form} backgroundColor={'#21608A'} backgroundColorSecond={'#2AA4F4'}/>
        </div>

        {/* paginated list of student applications summary */}
           <ApplicationSummary data={data} />   

      </div>
      <Outlet />
    </div>
  );
};

export default AdminDashboard;