// src/components/ResetPassword.js
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Resetpassword.css';
import reset from '../Image/cpimg123.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';

// Define validation schema using Yup
const validationSchema = Yup.object({
    phone: Yup.string()
        .matches(/^\d{10}$/, 'Phone number must be in the format +91xxxxxxxxxx')
        .required('Phone number is required'),
    newPassword: Yup.string()
        .min(6, 'Password must be at least 6 characters long')
        .matches(/^\d+$/, 'Password must contain only numbers')
        .required('New Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
        .required('Confirm Password is required'),
});

const ResetPassword = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const phone = location.state?.phone || ''; // Retrieve phone number from location state

    const formik = useFormik({
        initialValues: {
            phone: `${phone}`,
            newPassword: '',
            confirmPassword: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
               
                const response = await axios.post('http://49.204.232.254:90/users/updatepassword', {
                    phonenumber: values.phone,
                    newPassword: values.newPassword
                });

                console.log('Password Reset Response:', response.data);

                Swal.fire({
                    icon: 'success',
                    title: 'Password Reset',
                    text: 'Your password has been reset successfully.',
                }).then(() => {
                    navigate('/login'); // Navigate to login page after successful reset
                });
            } catch (error) {
                console.error('Password Reset Error:', error.response ? error.response.data : error.message);
                Swal.fire({
                    icon: 'error',
                    title: 'Reset Failed',
                    text: 'There was an error resetting your password. Please try again.',
                });
            }
        },
    });

    return (
        <div className='backing'>
        <div className="reset-password-wrapper">
            <Row>
                <Col lg={1}></Col>
                <Col lg={5}>
                    <div className="img-col">
                        <img className='img-container' src={reset} alt="Reset Password" />
                    </div>
                </Col>
                <Col lg={5}>
                    <div className="form-col">
                        <div className="form-container">
                            <h1 className='form-title'>Reset Password</h1>
                            <form className="reset-password-form" onSubmit={formik.handleSubmit}>
                                <label htmlFor="phone">Phone Number</label>
                                <input
                                    type="text"
                                    id="phone"
                                    className='input-field'
                                    placeholder="Phone number"
                                    {...formik.getFieldProps('phone')}
                                    readOnly
                                />
                                {formik.touched.phone && formik.errors.phone ? (
                                    <div className="form-error123">{formik.errors.phone}</div>
                                ) : null}

                                <label htmlFor="newPassword" style={{marginTop:"20px"}}>New Password</label>
                                <div className="input-wrapper">
                                    <input
                                        type={passwordVisible ? 'text' : 'password'}
                                        id="newPassword"
                                        className='input-field'
                                        placeholder="Enter new password"
                                        {...formik.getFieldProps('newPassword')}
                                        maxLength="6"
                                    />
                                    <span
                                        className="toggle-password"
                                        onClick={() => setPasswordVisible(!passwordVisible)}
                                    >
                                        {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </div>
                                {formik.touched.newPassword && formik.errors.newPassword ? (
                                    <div className="form-error123">{formik.errors.newPassword}</div>
                                ) : null}

                                <label htmlFor="confirmPassword" style={{marginTop:"20px"}}>Confirm Password</label>
                                <div className="input-wrapper">
                                    <input
                                        type={confirmPasswordVisible ? 'text' : 'password'}
                                        id="confirmPassword"
                                        className='input-field'
                                        placeholder="Confirm new password"
                                        {...formik.getFieldProps('confirmPassword')}
                                        maxLength="6"
                                    />
                                    <span
                                        className="toggle-password"
                                        onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                                    >
                                        {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </div>
                                {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                                    <div className="form-error123">{formik.errors.confirmPassword}</div>
                                ) : null}

                                <button type="submit" className="submit-button55">Reset Password</button>
                                <p className="login-redirect">
                                    Remember your password? <Link to="/login">Login</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </Col>
                <Col lg={1}></Col>
            </Row>
        </div>
        </div>
    );
};

export default ResetPassword;
