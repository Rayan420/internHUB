import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from '../services/axios';  // import axios from '../services/axios';
const LOGIN_URL = '/auth';
import { useSignIn } from 'react-auth-kit';
import { useNavigate } from 'react-router-dom';



/* LOGIN FORM COMPONENET */

const LoginForm = () => {
  const signIn = useSignIn();
  const emailRef = useRef();
  const errRef = useRef();
  const [email, setEmail] = useState('');
  const [pwd , setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    emailRef.current.focus();
  },[]);

  useEffect(() => {
    setErrMsg('');
  },[email, pwd]);
  
  useEffect(() => {
  }, []);
  
   /* handle login function */
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try
    {
      const response = await axios.post(LOGIN_URL, 
        JSON.stringify({email: email, password: pwd,}),
        {
          headers: {'Content-Type': 'application/json'},
          withCredentials: true,
        }
        );
        
       signIn({
        token: response.data.accessToken,
        expiresIn: 3600,
        tokenType: 'Bearer',
        authState: {
          role: response?.data?.role,
          email: email,
        },
       }) 

        setSuccess(true);
        setErrMsg('');
        setPwd('');
        setEmail('');
        navigate('/dashboard');

    }

    catch(err) {
      if(!err?.response) 
      {
        setErrMsg('No server response. Please try again later.');
      } 
      else if(err.response?.status==400)
       {
        setErrMsg('Invalid email or password.');
      } 
      else if(err.response?.status==401) 
      {
        setErrMsg('Invalid email or password.');
      }
      else 
      {
        setErrMsg('Login Failed. Please try again later.');
      }

      errRef.current.focus();
    }


  };
  


/*
    show or hide password icon function
    */
    const [showPassword, setShowPassword] = useState(false);
    
    function toggleShowPassword() {
        setShowPassword(!showPassword);
      }

    return (
    <div className="login-box">
        <h2>Login</h2>
        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} 
        aria-live="assertive">{errMsg} </p>
        <form onSubmit={handleSubmit }>
            <div className="user-box">
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

            <div className="user-box password">
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