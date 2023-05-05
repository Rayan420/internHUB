import { useState, useRef, useEffect } from 'react'; // import necessary hooks
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // import FontAwesomeIcon component
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; // import icons from FontAwesomeIcon
import axios from '../services/axios'; // import axios for making API calls
const LOGIN_URL = '/auth'; // set the login URL
import { useSignIn } from 'react-auth-kit'; // import useSignIn hook from react-auth-kit for authentication
import { useNavigate } from 'react-router-dom'; // import useNavigate hook from react-router-dom for navigation

/* LOGIN FORM COMPONENET */

const LoginForm = () => {
  const signIn = useSignIn(); // get the signIn function from useSignIn hook
  const emailRef = useRef(); // create a ref for email input field
  const errRef = useRef(); // create a ref for error message
  const [email, setEmail] = useState(''); // create state for email input
  const [pwd , setPwd] = useState(''); // create state for password input
  const [errMsg, setErrMsg] = useState(''); // create state for error message
  const [success, setSuccess] = useState(false); // create state for success message
  const navigate = useNavigate(); // get the navigate function from useNavigate hook

  useEffect(() => {
    emailRef.current.focus(); // set focus on email input on component mount
  },[]);

  useEffect(() => {
    setErrMsg(''); // clear error message when email or password state changes
  },[email, pwd]);
  
  useEffect(() => {
  }, []);
  
   /* handle login function */
  
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent default form submission behavior
    try
    {
      const response = await axios.post(LOGIN_URL, 
        JSON.stringify({email: email, password: pwd,}), // send email and password data in request body
        {
          headers: {'Content-Type': 'application/json'}, // set content type header
          withCredentials: true, // enable sending cookies with request
        }
        );
        
       signIn({
        token: response.data.accessToken, // set authentication token
        expiresIn: 3600, // set expiration time of token
        tokenType: 'Bearer', // set token type
        authState: {
          role: response?.data?.role, // set user role
          email: email, // set user email
        },
       }) 

        setSuccess(true); // set success state to true
        setErrMsg(''); // clear error message
        setPwd(''); // clear password state
        setEmail(''); // clear email state
        navigate('/dashboard'); // navigate to dashboard page

    }

    catch(err) { // handle error
      if(!err?.response) 
      {
        setErrMsg('No server response. Please try again later.'); // set error message for no response from server
      } 
      else if(err.response?.status==400)
       {
        setErrMsg('Invalid email or password.'); // set error message for invalid email or password
      } 
      else if(err.response?.status==401) 
      {
        setErrMsg('Invalid email or password.'); // set error message for invalid email or password
      }
      else 
      {
        setErrMsg('Login Failed. Please try again later.'); // set error message for general login failure
      }

      errRef.current.focus(); // set focus on error message
    }


  };
  

/*
    show or hide password icon function
    */
    const [showPassword, setShowPassword] = useState(false);
    
    function toggleShowPassword() {
        setShowPassword(!showPassword);
      }


      // CSS class for shaking input field
  const shakeClass = errMsg ? 'shake' : '';

  // CSS class for red border on input field
  const borderClass = errMsg ? 'red-border' : '';


    return (
    <div className={`login-box login-section ${errMsg ? shakeClass : ""}`}>
        <h2>Login</h2>
        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} 
        aria-live="assertive">{errMsg} </p>
        <form onSubmit={handleSubmit }>
            <div className={`user-box ${borderClass}`}>
                <label>Email</label>
                <input
                 type="text"
                  name="email" 
                  ref={emailRef} 
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  id='email'
               />
            </div>

            <div className={`user-box password ${borderClass}`}>
                <label>Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  required
              />
              <FontAwesomeIcon
              icon={showPassword ? faEye : faEyeSlash}
              onClick={toggleShowPassword}
              className="password-icon"
            />
            </div>
            <small>
            {/*place react router here to direct to reset link*/}
            <a className='forgot-password' href="#">Reset password?</a>
            </small>
            {/*login button*/}
            <button className='btn login-button'>Login</button> 
                
            </form>
    </div>       
    );
};

export default LoginForm;