import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Login/login.css';
import loginimg from '../Image/good123.png.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col } from 'react-bootstrap';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { auth, provider } from './firebase';
import { signInWithPopup } from 'firebase/auth';
import { FcGoogle } from "react-icons/fc";
import Swal from 'sweetalert2';

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [googleUser, setGoogleUser] = useState(null);
  const [isGoogleSignIn, setIsGoogleSignIn] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      phonenumber: "",
      password: '',
    },
    validationSchema: Yup.object({
      phonenumber: Yup.string()
        .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
        .required('Phone number is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters long')
        .matches(/^\d{6}$/, 'Password must contain only numbers')
        .required('Password is required')
    }),
    onSubmit: async (values) => {
      try {
       
        const loginResponse = await axios.post("http://49.204.232.254:90/users/login", {
          phonenumber: values.phonenumber,
          password: values.password,
        });
    
        sessionStorage.setItem('phonenumber', values.phonenumber);
        Swal.fire({
          icon: 'success',
          title: 'Logged in successfully',
          text: 'You will be redirected to the main screen.',
          timer: 1500,
          showConfirmButton: false
        });
        setTimeout(() => navigate('/MainScreen'), 1500);
      } catch (error) {
 
        setErrorMessage(error.response?.data?.message || 'Login failed. Please check your credentials.');
      }
    },
    
  });
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const email = user.email;
  
      const response = await axios.get("http://49.204.232.254:90/users/getall");
      console.log("API Response:", response.data);
  
      const users = response.data.data; 
  
  
      if (Array.isArray(users)) {
        const userExists = users.some(existingUser => existingUser.email === email);
  
        if (userExists) {
          
          const userData = users.find(existingUser => existingUser.email === email);
          sessionStorage.setItem('phonenumber', userData.phonenumber);
  
          Swal.fire({
            icon: 'success',
            title: 'Logged in successfully',
            text: 'You will be redirected to the main screen.',
            timer: 1500,
            showConfirmButton: false
          });
          setTimeout(() => navigate('/MainScreen'), 1500);
        } else {
        
          setIsGoogleSignIn(true);
          setGoogleUser({
            ...user,
            image: user.photoURL || null, 
          });
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Unexpected response format from API.',
        });
      }
    } catch (error) {
      console.error('Error during Google Sign-In:', error);
      Swal.fire({
        icon: 'error',
        title: 'Google Sign-In failed',
        text: error.message,
      });
    }
  };
  
  const handleSendOtp = async (phonenumber) => {
    try {
      const response = await axios.post("http://49.204.232.254:90/mobileauth/send-otp-sms", { number: phonenumber });
      Swal.fire({
        title: 'OTP sent successfully!',
        text: 'Please enter the OTP you received.',
        input: 'text',
        inputPlaceholder: 'Enter OTP',
        showCancelButton: true,
        confirmButtonText: 'Verify OTP',
        showLoaderOnConfirm: true,
        preConfirm: (otp) => {
          return axios.post("http://49.204.232.254:90/mobileauth/verify-otp-sms", { number: phonenumber, otp: otp })
            .then(response => {
              return response.data;
            })
            .catch(error => {
              Swal.showValidationMessage(
                `OTP verification failed: ${error.response?.data?.message || 'Please try again.'}`
              );
            });
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (result.isConfirmed) {
          const { data } = result.value;
          const userData = {
            username: googleUser?.displayName || 'User',
            email: googleUser?.email,
            phonenumber: phonenumber,
            googleId: googleUser?.uid,
            image: googleUser?.image || null,
          };

          axios.post("http://49.204.232.254:90/users/create", userData)
            .then(saveResponse => {
              sessionStorage.setItem('username', saveResponse.data.data.username);
              sessionStorage.setItem('userEmail', saveResponse.data.data.email);
              sessionStorage.setItem('phonenumber', phonenumber);

              Swal.fire({
                icon: 'success',
                title: 'User created successfully!',
                text: 'You will be redirected to the main screen.',
                timer: 1500,
                showConfirmButton: false,
              });

              setTimeout(() => navigate('/MainScreen'), 1500);
            })
            .catch(err => {
              Swal.fire({
                icon: 'error',
                title: 'User creation failed!',
                text: err.response?.data?.message || 'Please try again.',
              });
            });
        }
      });
    } catch (error) {
      console.error('Error sending OTP:', error);
      Swal.fire({
        icon: 'error',
        title: 'Failed to send OTP',
        text: error.response?.data?.message || 'Please try again.',
      });
    }
  };

  return (
    <div className='login-background'>
      <Row className='Row-contain'>
        <Col className='login-image-col'>
          <h1 className='login-header'>CurioCampus</h1>
          <img className='login-image' src={loginimg} alt="Login" />
        </Col>
        <Col>
          {!isGoogleSignIn ? (
            <form className="login-form" onSubmit={formik.handleSubmit}>
              <div className="form-group">
                <label htmlFor="phonenumber">Phone Number</label>
                <input
                  id="phonenumber"
                  type="text"
                  className="form-control22"
                  placeholder="  Phone Number"
                  {...formik.getFieldProps('phonenumber')}
                  value={formik.values.phonenumber}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (/^\d{0,10}$/.test(inputValue)) {
                      formik.setFieldValue('phonenumber', inputValue);
                    }
                  }}
                  maxLength="10"
                />
                {formik.touched.phonenumber && formik.errors.phonenumber ? (
                  <div className="form-error">{formik.errors.phonenumber}</div>
                ) : null}
              </div>
  
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-field position-relative">
                  <input
                    id="password"
                    type={passwordVisible ? 'text' : 'password'}
                    className="form-control22"
                    placeholder="  Password"
                    {...formik.getFieldProps('password')}
                    maxLength="6"
                  />
                  <span
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    style={{
                      marginBottom: '10px',
                      position: 'absolute',
                      right: '10px',
                      top: '26%',
                      cursor: 'pointer',
                      color: '#333',
                    }}
                  >
                    {passwordVisible ? <FaRegEyeSlash /> : <FaRegEye />}
                  </span>
                </div>
                {formik.touched.password && formik.errors.password ? (
                  <div className="form-error">{formik.errors.password}</div>
                ) : null}
              </div>
  
              {errorMessage && <div className="form-error">{errorMessage}</div>}
  
              <div className="form-footer">
                <Link to="/forgot-password" className="forgot-password">Forgot password?</Link>
              </div>
              <button className="submit-buttonlogin99" type="submit">Login</button>
              <p className="signup-prompt">Don't have an account? <Link to="/signup" className="signup-link">Sign Up</Link></p>
              <p className="or-with">Or With</p>
  
              <div className="social-button-container">
                <button className="social-button" type="button" onClick={handleGoogleSignIn}>
                  <FcGoogle />
                  Sign in with Google
                </button>
              </div>
            </form>
          ) : (
            <div>
            <form className="login-form" onSubmit={formik.handleSubmit}>
              
              <div className="form-group">
                <label htmlFor="phonenumber">Enter Phone Number</label>
                <input
                  id="phonenumber"
                  type="text"
                  className="form-control22"
                  placeholder="Phone Number"
                  {...formik.getFieldProps('phonenumber')}
                  value={formik.values.phonenumber}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (/^\d{0,10}$/.test(inputValue)) {
                      formik.setFieldValue('phonenumber', inputValue);
                    }
                  }}
                  maxLength="10"
                />
                {formik.touched.phonenumber && formik.errors.phonenumber ? (
                  <div className="form-error">{formik.errors.phonenumber}</div>
                ) : null}
              </div>
  
              <button
                className="submit-buttonlogin12"
                onClick={() => handleSendOtp(formik.values.phonenumber)}
              >
                Send OTP
              </button>
              </form>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
  
};

export default Login;