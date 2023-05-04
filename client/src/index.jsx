import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "react-auth-kit";
const root = document.getElementById("root");
import SideNavbar from './components/admincomponents/NavBar';

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <AuthProvider
        authType={"cookie"}
        authName={"_auth"}
        cookieDomain={window.location.hostname}
        cookieSecure={false}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>

    </AuthProvider>
   
  </React.StrictMode>
);
