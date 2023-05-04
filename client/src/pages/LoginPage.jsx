import logo from '../assets/logo.png';
import '/style/style.css';
import LoginForm from '../components/LoginForm';



const LoginPage = () => {
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
        <p className="info">BİLGİLENDİRME / INFORMATION</p>
        <p className="note">Students: can login to the system with uskudar student email and email password.</p>
        <p className="note">Coordinators: can login to the system with Üsküdar University corporate e-mail <br></br>address username (name.surname@uskudar.edu.tr) and password.</p>
        <p className="note">Centers: can login to the system with <b>approved</b> business emails and passwords.</p>

      </div>
    </div>
  );
};

export default LoginPage;