import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import './forgotPassword.css';
import { Row, Col } from 'react-bootstrap';
import f1 from '../Image/forget1.png';
import Swal from 'sweetalert2';
import axios from 'axios';

const validationSchema = Yup.object({
    phone: Yup.string()
        .matches(/^\d{10}$/, 'Mobile number must be in the format +91XXXXXXXXXX')
        .required('Mobile Number is required'),
});

const ForgotPasswordForm = () => {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            phone: '', 
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
               
                const response = await axios.post("http://49.204.232.254:90/mobileauth/send-otp-sms", {
                    number: values.phone,
                    appName: "CurioCampus"
                });
                
                navigate('/verify-otp', { state: { phone: values.phone } });
                
                Swal.fire({
                    icon: 'success',
                    title: 'OTP Sent',
                    text: 'An OTP has been sent to your phone number.',
                });
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to Send OTP',
                    text: 'There was an error sending the OTP. Please try again.',
                });
            }
        },
    });

    const handlePhoneChange = (e) => {
        let value = e.target.value.replace(/[^\d]/g, '').slice(0, 10); 
    
        formik.setFieldValue('phone', value); 
    };
    
    return (
        <div className='bgggg'>
        <div className="gradient-background">
            <Row>
                <Col className="image-col">
                    <div className="image-container">
                        <img src={f1} alt="Forgot Password" />
                    </div>
                </Col>
                <Col className="form-col">
                    <div className="form-container1">
                        <h1 className='headerforget'>Forgot Password</h1>
                        <form className="forgot-password-form" onSubmit={formik.handleSubmit}>
                            <div>
                                <label htmlFor="phone" style={{marginTop:"10px"}}>Phone Number</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    className='inputforget'
                                    placeholder="Enter your Phone Number"
                                    value={formik.values.phone}
                                    onChange={handlePhoneChange}
                                    maxLength="13"
                                />
                                {formik.touched.phone && formik.errors.phone ? (
                                    <div className="error-message">{formik.errors.phone}</div>
                                ) : null}
                            </div>
                            <div style={{marginTop:"20px"}}>
                            <button type="submit" className="button-submit">
                                Send OTP
                            </button></div>
                            <p className="back-to-login">
                                Remembered your password? <Link to="/">Login</Link>
                            </p>
                        </form>
                    </div>
                </Col>
            </Row>
        </div>
        </div>
    );
};

export default ForgotPasswordForm;
