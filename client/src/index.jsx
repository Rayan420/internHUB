import React from "react"; // Importing the React library
import ReactDOM from "react-dom/client"; // Importing the ReactDOM library
import { BrowserRouter } from "react-router-dom"; // Importing the BrowserRouter from the react-router-dom library
import App from "./App"; // Importing the App component from the App.js file
import { AuthProvider } from "react-auth-kit"; // Importing the AuthProvider component from the react-auth-kit library

const root = document.getElementById("root"); // Assigning the root element to a variable named 'root'
ReactDOM.createRoot(root).render( // Rendering the App component to the root element using ReactDOM
  
  <React.StrictMode> {/*Enabling strict mode*/}
  {/*Wrapping the App component with the AuthProvider component*/}
    <AuthProvider 
        authType={"cookie"}  //Setting the authentication type to cookie
        authName={"_auth"}  //Setting the name of the authentication cookie
        cookieDomain={window.location.hostname} //Setting the domain for the authentication cookie
        cookieSecure={false} //Setting the secure flag for the authentication cookie
    >
      <BrowserRouter> {/*Wrapping the App component with BrowserRoute*/}
        <App /> // {/*Rendering the App component*/}
      </BrowserRouter>

    </AuthProvider>
   
  </React.StrictMode>
);
