import AdminDashboard from "./AdminDashboard";
import StudentDashboard from "./StudentDashboard";
import CareeCenterDashboard from "./CareerCenterDashboard";
import CoordinatorDashboard from "./CoordinatorDashboard";
import { useAuthUser } from "react-auth-kit";
import { useIsAuthenticated } from "react-auth-kit";

function DashboardPage() {
  const isAuthenticated = useIsAuthenticated();
  const auth = useAuthUser();
  const role = auth().role;
  if (isAuthenticated) {
    switch (role) {
      case "Admin":
        return <AdminDashboard />;
      case "Student":
        return <StudentDashboard />;
      case "Careercenter":
        return <CareeCenterDashboard />;
      case "Coordinator":
        return <CoordinatorDashboard />;
      default:
        return <div>unauthorized access</div>;
    }
  }
}

export default DashboardPage;
