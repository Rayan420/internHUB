import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

{/* LOGIN FORM COMPONENET */}

const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    
    function toggleShowPassword() {
        setShowPassword(!showPassword);
      }

    return (
    <div className="login-box">
        <h2>Login</h2>
        <form >
            <div className="user-box">
                <label>Email</label>
                <input type="text" name="email" required=""/>
            </div>

            <div className="user-box password">
                <label>Password</label>
                <input
          type={showPassword ? 'text' : 'password'}
          id="password"
          name="password"
            />
            <FontAwesomeIcon
          icon={showPassword ? faEye : faEyeSlash}
          onClick={toggleShowPassword}
          className="password-icon"
         />
            </div>

            {/*login button*/}
            <a className='forgot-password' href="">Forgot password?</a>
            <button type="button" className='btn login-button' onClick={()=>{
               {/* LOGIN AUTHENTICATION FUNCTION GOES HERE */};
            }}>Login</button>     
            </form>
    </div>       
    );
};

export default LoginForm;