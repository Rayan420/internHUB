import LoginPage from "./pages/LoginPage";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import { RequireAuth } from "react-auth-kit";
import Users from "./pages/Users";
import Messages from "./pages/Messages";
import Internships from "./pages/Internships";
import SettingsPage from "./pages/Settings";
import ApplicationsPage from "./pages/ApplicationPage";
import Jobs from "./pages/Jobs";
function App() {
  return (
    <Routes>
      <Route exact path="/" element={<LoginPage />} />
      <Route
        exact
        path="/dashboard"
        element={
          <RequireAuth loginPath="/">
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route
        exact
        path="/messages"
        element={
          <RequireAuth loginPath="/">
            <Messages />
          </RequireAuth>
        }
      />
      <Route
        exact
        path="/users"
        element={
          <RequireAuth loginPath="/">
            {" "}
            <Users />
          </RequireAuth>
        }
      />
      <Route
        exact
        path="/internships"
        element={
          <RequireAuth loginPath="/">
            <Internships />
          </RequireAuth>
        }
      />
      <Route
        exact
        path="/settings"
        element={
          <RequireAuth loginPath="/">
            {" "}
            <SettingsPage />
          </RequireAuth>
          
        }
      />
         <Route
        exact
        path="/applications"
        element={
          <RequireAuth loginPath="/">
            {" "}
            <ApplicationsPage />
          </RequireAuth>
          
        }
      />
        <Route
        exact
        path="/jobs"
        element={
          <RequireAuth loginPath="/">
            {" "}
            <Jobs />
          </RequireAuth>
          
        }
      />
    </Routes>
  );
}
export default App;
