import { createRoot } from "react-dom/client";
import logo from '../assets/logo.png';
import LoginForm from "./LoginForm";


const App = () => {
  return (
    <div className="container">
      <div className="colored-strip">
        <div className="content">
          <img id="logo" src={logo} alt="site logo" />
          <h2 id="strip-text">applying for internships has never been easier!</h2>
        </div> 
      </div>
      <div className="login-section">
        <LoginForm />
        <p className="note">Note: Students and instructors should login using their official Uskudar University email address. <br/>Career centers can login using the approved address.</p>
      </div>
      
    </div>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);