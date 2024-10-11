import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './Signup.css';
import loginimg from '../Image/good123.png.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col, Modal, Button } from 'react-bootstrap';
import { FaUserAlt, FaPhoneVolume, FaEye, FaEyeSlash, FaCheckCircle, FaUserLock, FaEdit } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const validationSchema = Yup.object({
    username: Yup.string()
        .matches(/^[a-zA-Z]+$/, 'Username must contain only letters')
        .min(3, 'Username must be at least 3 characters long')
        .required('Username is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters long')
        .matches(/^\d+$/, 'Password must contain only numbers')
        .required('Password is required'),
    confirmpassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .min(6, 'Confirm Password must be at least 6 characters long')
        .matches(/^\d+$/, 'Confirm Password must contain only numbers')
        .required('Confirm Password is required'),
    phonenumber: Yup.string()
        .matches(/^\d{10}$/, 'Mobile number must be exactly 10 digits')
        .required('Mobile Number is required')
});

const Signup = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [enteredOtp, setEnteredOtp] = useState('');
    const [errorMessage, setErrorMessage] = useState("");
    const [otpVerified, setOtpVerified] = useState(false);
    const [isEditingPhoneNumber, setIsEditingPhoneNumber] = useState(false);
    const navigate = useNavigate();
    const [otpRequestId, setOtpRequestId] = useState('');

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
            confirmpassword: '',
            phonenumber: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            if (!otpVerified) {
                setErrorMessage('Please verify OTP before submitting.');
                return;
            }
            try {
              
                await axios.post("http://49.204.232.254:90/users/create", {
                    ...values,
                    phonenumber: values.phonenumber // Ensure the phone number is stored as is
                });

             
                localStorage.setItem('username', values.username);

                Swal.fire({
                    icon: 'success',
                    title: 'Signup Successful',
                    text: 'You have successfully signed up. Redirecting to login...',
                    timer: 1500,
                    showConfirmButton: false
                });

                
                setTimeout(() => navigate('/login'), 1500);
            } catch (error) {
                
                setErrorMessage(error.response?.data?.Message || 'Signup failed. Please try again.');
                Swal.fire({
                    icon: 'error',
                    title: 'Signup Failed',
                    text: error.response?.data?.Message || 'Please try again.',
                });
            }
        }
    });

    const handleSendOtp = async () => {
        const phoneNumber = formik.values.phonenumber;

        if (phoneNumber.length !== 10) {
            setErrorMessage('Please enter a valid 10-digit phone number before requesting an OTP.');
            return;
        }

        setErrorMessage('');

        try {
            const response = await axios.post("http://49.204.232.254:90/mobileauth/send-otp-sms", {
                number: phoneNumber,
                appName: "CurioCampus"
            });
            setOtpRequestId(response.data.Number);
            setShowOtpModal(true);
        } catch (error) {
            setErrorMessage('Failed to send OTP. Please try again.');
            Swal.fire({
                icon: 'error',
                title: 'OTP Failed',
                text: 'Failed to send OTP. Please try again.',
            });
        }
    };

    const handleOtpVerification = async () => {
        try {
            const response = await axios.post("http://49.204.232.254:90/mobileauth/verify-otp-sms", {
                number: otpRequestId,
                otp: enteredOtp
            });

            if (response.data.message === "User verified") {
                setOtpVerified(true);
                setShowOtpModal(false);
                setIsEditingPhoneNumber(false);
                setErrorMessage('');
            } else {
                setErrorMessage('Invalid OTP. Please try again.');
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid OTP',
                    text: 'The OTP you entered is invalid. Please try again.',
                });
            }
        } catch (error) {
            setErrorMessage('Failed to verify OTP. Please try again.');
            Swal.fire({
                icon: 'error',
                title: 'Verification Failed',
                text: 'Failed to verify OTP. Please try again.',
            });
        }
    };

    const handleEditPhoneNumber = () => {
        setIsEditingPhoneNumber(true);
        setOtpVerified(false);
        setEnteredOtp('');
    };

    const handlePhoneNumberChange = (e) => {
        const inputValue = e.target.value;
        if (/^\d*$/.test(inputValue) && inputValue.length <= 10) {
            formik.setFieldValue('phonenumber', inputValue); 
        }
    };

    return (
        <div className='back'>
            <Row className='Row-contain'>
                <Col>
                    <h1 className='signup-header'>CurioCampus</h1>
                    <img className='loginimg' src={loginimg} alt="Signup" />
                </Col>
                <Col>
                    <form className="form" onSubmit={formik.handleSubmit}>
                        <div className="flex-column">
                            <label htmlFor="username">Username</label>
                        </div>
                        <div className="inputForm">
                            <FaUserAlt className="icon" />
                            <input
                                id="username"
                                type="text"
                                className="input"
                                placeholder=" Username"
                                {...formik.getFieldProps('username')}
                            />
                            {formik.touched.username && formik.errors.username ? (
                                <div className="error">{formik.errors.username}</div>
                            ) : null}
                        </div>

                        <div className="flex-column">
                            <label htmlFor="email" >Email</label>
                        </div>
                        <div className="inputForm">
                            <MdEmail className="icon" />
                            <input
                                id="email"
                                type="text"
                                className="input"
                                placeholder="  Email"
                                {...formik.getFieldProps('email')}
                            />
                            {formik.touched.email && formik.errors.email ? (
                                <div className="error">{formik.errors.email}</div>
                            ) : null}
                        </div>

                        <div className="flex-column">
                            <label htmlFor="password">Password</label>
                        </div>
                        <div className="inputForm">
                            <FaUserLock className='icons' />
                            <input
                                id="password"
                                type={passwordVisible ? 'text' : 'password'}
                                className="input"
                                placeholder="Password"
                                {...formik.getFieldProps('password')}
                                maxLength="6"
                            />
                            <button
                                type="button"
                                className="password-toggle123"
                                onClick={() => setPasswordVisible(!passwordVisible)}
                            >
                                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                            </button>
                            {formik.touched.password && formik.errors.password ? (
                                <div className="error">{formik.errors.password}</div>
                            ) : null}
                        </div>

                        <div className="flex-column">
                            <label htmlFor="confirmpassword">Confirm Password</label>
                        </div>
                        <div className="inputForm">
                            <FaUserLock className='icons' />
                            <input
                                id="confirmpassword"
                                type={confirmPasswordVisible ? 'text' : 'password'}
                                className="input"
                                placeholder="Confirm Password"
                                {...formik.getFieldProps('confirmpassword')}
                                maxLength="6"
                            />
                            <button
                                type="button"
                                className="password-toggle123"
                                onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                            >
                                {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                            </button>
                            {formik.touched.confirmpassword && formik.errors.confirmpassword ? (
                                <div className="error">{formik.errors.confirmpassword}</div>
                            ) : null}
                        </div>

                        <div className="flex-column">
                            <label htmlFor="phonenumber">Phone Number</label>
                        </div>
                        <div className="inputForm">
                            <FaPhoneVolume className="icon" />
                            <input
                                id="phonenumber"
                                type="tel"
                                className="input"
                                placeholder="   Phone Number"
                                value={formik.values.phonenumber}
                                onChange={handlePhoneNumberChange}
                                disabled={otpVerified && !isEditingPhoneNumber}
                                maxLength="10" // 10 digits
                            />
                            {otpVerified && !isEditingPhoneNumber && (
                                <button
                                    type="button"
                                    className="edit-button123"
                                    onClick={handleEditPhoneNumber}
                                >
                                    <FaEdit />
                                </button>
                            )}
                            {formik.touched.phonenumber && formik.errors.phonenumber ? (
                                <div className="error">{formik.errors.phonenumber}</div>
                            ) : null}
                        </div>

                        <button
                            type="button"
                            className={`button-send-otp ${otpVerified ? 'verified' : ''}`}
                            onClick={handleSendOtp}
                            disabled={otpVerified}
                        >
                            {otpVerified ? (
                                <>
                                    <FaCheckCircle style={{ marginRight: '8px' }} /> Verified
                                </>
                            ) : (
                                'Send OTP'
                            )}
                        </button>

                        {errorMessage && (
                            <div className="error1">{errorMessage}</div>
                        )}

                        <button className="button-submit" type="submit" disabled={formik.isSubmitting}>
                            {formik.isSubmitting ? 'Submitting...' : 'Sign Up'}
                        </button>
                        <p className='back-login'>back to <a href='/Login'>Login</a></p>
                        <Modal show={showOtpModal} onHide={() => setShowOtpModal(false)} centered>
                            <Modal.Header closeButton>
                                <Modal.Title>Enter OTP</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <input
                                    type="text"
                                    className="input-modal1"
                                    value={enteredOtp}
                                    onChange={(e) => setEnteredOtp(e.target.value)}
                                    placeholder="Enter OTP"
                                />
                            </Modal.Body>
                            <Modal.Footer>
                                
                                <Button variant="primary" className='modal-bt1' onClick={handleOtpVerification}>
                                    Verify OTP
                                </Button>
                                <Button variant="secondary" className='modal-bt2' onClick={() => setShowOtpModal(false)}>
                                    Cancel
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </form>
                </Col>
            </Row>
        </div>
    );
};

export default Signup;
