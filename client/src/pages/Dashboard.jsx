import AdminDashboard from './AdminDashboard';
import StudentDashboard from './StudentDashboard';
import CareeCenterDashboard from './CareerCenterDashboard';
import CoordinatorDashboard from './CoordinatorDashboard';
import {useAuthUser} from 'react-auth-kit'
import {useIsAuthenticated} from 'react-auth-kit'

function DashboardPage() 
{
  const isAuthenticated = useIsAuthenticated();
  const auth  = useAuthUser();
  const role = auth().role;
  if(isAuthenticated)
  {
    switch(role)
    {
      case 'admin':
        return <AdminDashboard />;
      case 'student':
        return <StudentDashboard />;
      case 'careercenter':
        return <CareeCenterDashboard />;
      case 'coordinator':
        return <CoordinatorDashboard />;
      default:
        return <div>unauthorized access</div>;
    }
  }      
  }
  
export default DashboardPage;