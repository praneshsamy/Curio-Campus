// // src/components/SendOTP.js
// import React, { useState, useEffect, useRef } from 'react';
// import { Row, Col } from 'react-bootstrap';
// import { useNavigate, useLocation } from 'react-router-dom';
// import axios from 'axios'; // Import axios for API requests
// import Swal from 'sweetalert2'; // Import SweetAlert2 for notifications
// import './sendotp.css';
// import otpimg from '../Image/otp-image12.png';

// const SendOTP = () => {
//     const [otp, setOtp] = useState(['', '', '', '', '', '']);
//     const [showBullets, setShowBullets] = useState(new Array(6).fill(false));
//     const [displayTimeouts, setDisplayTimeouts] = useState(new Array(6).fill(null));
//     const [timeLeft, setTimeLeft] = useState(60);
//     const [timerActive, setTimerActive] = useState(true);
//     const navigate = useNavigate();
//     const location = useLocation();
//     const phone = location.state?.phone || ''; // Retrieve phone number from location state

//     // Refs for OTP inputs
//     const inputRefs = useRef([]);

//     useEffect(() => {
//         // Clear timeouts if the component unmounts
//         return () => displayTimeouts.forEach(timeout => clearTimeout(timeout));
//     }, [displayTimeouts]);

//     const handleChange = (e, index) => {
//         const value = e.target.value;

//         // Allow only numeric values
//         if (/^\d?$/.test(value)) {
//             const newOtp = [...otp];
//             newOtp[index] = value;
//             setOtp(newOtp);

//             // Clear any existing timeout for the current input
//             clearTimeout(displayTimeouts[index]);

//             // Set timeout to show bullets after 0.7 seconds
//             const newDisplayTimeouts = [...displayTimeouts];
//             newDisplayTimeouts[index] = setTimeout(() => {
//                 const updatedShowBullets = [...showBullets];
//                 updatedShowBullets[index] = true; // Show bullets for the specific input
//                 setShowBullets(updatedShowBullets);
//             }, 700); // 0.7 seconds timeout for each input field

//             setDisplayTimeouts(newDisplayTimeouts);

//             // Move focus to next input if the current input is filled
//             if (value.length === 1 && index < otp.length - 1) {
//                 inputRefs.current[index + 1]?.focus();
//             } else if (value.length === 0 && index > 0) {
//                 inputRefs.current[index - 1]?.focus();
//             }
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {
//             const otpString = otp.join('');
//             console.log('Submitting OTP:', otpString);
//             console.log('Phone Number:', phone);

//             const response = await axios.post("http://49.204.232.254:90/mobileauth/verify-otp-sms", {
//                 number: phone.slice(3), // Remove '+91' from the phone number
//                 otp: otpString
//             });

//             console.log('OTP Verification Response:', response.data);

//             if (response.data.message === "User verified") {
//                 Swal.fire({
//                     icon: 'success',
//                     title: 'OTP Verified',
//                     text: 'Your OTP has been verified. Redirecting to reset password...',
//                 }).then(() => navigate('/reset-password', { state: { phone } }));
//             } else {
//                 Swal.fire({
//                     icon: 'error',
//                     title: 'Invalid OTP',
//                     text: 'The OTP you entered is invalid. Please try again.',
//                 });
//             }
//         } catch (error) {
//             console.error('OTP Verification Error:', error.response ? error.response.data : error.message);
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Verification Failed',
//                 text: 'Failed to verify OTP. Please try again.',
//             });
//         }
//     };

//     const handleResendCode = async () => {
//         try {
//             const response = await axios.post("http://49.204.232.254:90/mobileauth/send-otp-sms", {
//                 number: phone.slice(3), // Remove '+91' from the phone number
//                 appName: "CurioCampus"
//             });

//             console.log('OTP Resend Response:', response.data);

//             if (response.data.status === "success") {
//                 Swal.fire({
//                     icon: 'success',
//                     title: 'OTP Sent',
//                     text: 'A new OTP has been sent to your phone.',
//                 });
//                 resetTimer();
//             } else {
//                 Swal.fire({
//                     icon: 'error',
//                     title: 'Resend Failed',
//                     text: 'Failed to resend OTP. Please try again.',
//                 });
//             }
//         } catch (error) {
//             console.error('OTP Resend Error:', error.response ? error.response.data : error.message);
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Resend Failed',
//                 text: 'Failed to resend OTP. Please try again.',
//             });
//         }
//     };

//     const resetTimer = () => {
//         setTimeLeft(120); // Reset timer to 2 minutes
//         setTimerActive(true);
//     };

//     useEffect(() => {
//         if (timerActive && timeLeft > 0) {
//             const interval = setInterval(() => {
//                 setTimeLeft(prevTime => prevTime - 1);
//             }, 1000);
//             return () => clearInterval(interval);
//         } else {
//             setTimerActive(false);
//         }
//     }, [timeLeft, timerActive]);

//     return (
//         <div className="send-otp-container">
//             <Row className='Row-container'>
//                 <Col md={6} className="otp-image-col">
//                     <img src={otpimg} alt="OTP" className="otp-image" />
//                 </Col>
//                 <Col md={6} className="otp-form-col" style={{ marginLeft: "-98px" }}>
//                     <div className="otp-form1">
//                         <h1 className='head'>Verify OTP</h1>
//                         <div className="otp-subheading">
//                             Enter the OTP sent to your phone number: <strong>{phone}</strong>
//                         </div>
//                         <form onSubmit={handleSubmit}>
//                             <div className="otp-input-container">
//                                 {otp.map((digit, index) => (
//                                     <input
//                                         key={index}
//                                         id={`otp-input${index + 1}`}
//                                         type={showBullets[index] ? "password" : "text"} // Conditional input type
//                                         value={digit}
//                                         onChange={(e) => handleChange(e, index)}
//                                         maxLength="1"
//                                         className="otp-input"
//                                         ref={el => inputRefs.current[index] = el} // Set ref for each input
//                                     />
//                                 ))}
//                             </div>
//                             <button type="submit" className="verify-button">Verify</button>
//                             <p className='back-phonenumber'>
//                                 Back to <a href='/forgot-password'>Phone Number</a>
//                             </p>
//                             <p className="resend-note">
//                                 {timeLeft > 0 ? `Resend code in ${Math.floor(timeLeft / 60)}:${timeLeft % 60}` :
//                                     <button className="resend-button" onClick={handleResendCode}>Resend OTP</button>}
//                             </p>
//                         </form>
//                     </div>
//                 </Col>
//             </Row>
//         </div>
//     );
// };

// export default SendOTP;

// src/components/SendOTP.js
import React, { useState, useEffect, useRef } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios'; // Import axios for API requests
import Swal from 'sweetalert2'; // Import SweetAlert2 for notifications
import './sendotp.css';
import otpimg from '../Image/otp-image12.png';

const SendOTP = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [showBullets, setShowBullets] = useState(new Array(6).fill(false));
    const [displayTimeouts, setDisplayTimeouts] = useState(new Array(6).fill(null));
    const [timeLeft, setTimeLeft] = useState(60);
    const [timerActive, setTimerActive] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const phone = location.state?.phone || ''; // Retrieve phone number from location state

    // Refs for OTP inputs
    const inputRefs = useRef([]);

    useEffect(() => {
        // Clear timeouts if the component unmounts
        return () => displayTimeouts.forEach(timeout => clearTimeout(timeout));
    }, [displayTimeouts]);

    const handleChange = (e, index) => {
        const value = e.target.value;

        // Allow only numeric values
        if (/^\d?$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Clear any existing timeout for the current input
            clearTimeout(displayTimeouts[index]);

            // Set timeout to show bullets after 0.7 seconds
            const newDisplayTimeouts = [...displayTimeouts];
            newDisplayTimeouts[index] = setTimeout(() => {
                const updatedShowBullets = [...showBullets];
                updatedShowBullets[index] = true; // Show bullets for the specific input
                setShowBullets(updatedShowBullets);
            }, 700); // 0.7 seconds timeout for each input field

            setDisplayTimeouts(newDisplayTimeouts);

            // Move focus to next input if the current input is filled
            if (value.length === 1 && index < otp.length - 1) {
                inputRefs.current[index + 1]?.focus();
            } else if (value.length === 0 && index > 0) {
                inputRefs.current[index - 1]?.focus();
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const otpString = otp.join('');
        const formattedPhone = phone; 
        console.log('Submitting OTP:', otpString);
        console.log('Phone Number:', formattedPhone);

        try {
            const response = await axios.post("http://49.204.232.254:90/mobileauth/verify-otp-sms", {
                number: formattedPhone, // Ensure this is correct
                otp: otpString
            });

            console.log('OTP Verification Response:', response.data);

            if (response.data.message === "User verified") {
                Swal.fire({
                    icon: 'success',
                    title: 'OTP Verified',
                    text: 'Your OTP has been verified. Redirecting to reset password...',
                }).then(() => navigate('/reset-password', { state: { phone } }));
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid OTP',
                    text: 'The OTP you entered is invalid. Please try again.',
                });
            }
        } catch (error) {
            console.error('OTP Verification Error:', error.response ? error.response.data : error.message);
            Swal.fire({
                icon: 'error',
                title: 'Verification Failed',
                text: error.response?.data?.error || 'Failed to verify OTP. Please try again.',
            });
        }
    };

    const handleResendCode = async () => {
        try {
            const response = await axios.post("http://49.204.232.254:90/mobileauth/send-otp-sms", {
                number: phone.slice(3), // Remove '+91' from the phone number
                appName: "CurioCampus"
            });

            console.log('OTP Resend Response:', response.data);

            if (response.data.status === "success") {
                Swal.fire({
                    icon: 'success',
                    title: 'OTP Sent',
                    text: 'A new OTP has been sent to your phone.',
                });
                resetTimer();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Resend Failed',
                    text: 'Failed to resend OTP. Please try again.',
                });
            }
        } catch (error) {
            console.error('OTP Resend Error:', error.response ? error.response.data : error.message);
            Swal.fire({
                icon: 'error',
                title: 'Resend Failed',
                text: 'Failed to resend OTP. Please try again.',
            });
        }
    };

    const resetTimer = () => {
        setTimeLeft(120); // Reset timer to 2 minutes
        setTimerActive(true);
    };

    useEffect(() => {
        if (timerActive && timeLeft > 0) {
            const interval = setInterval(() => {
                setTimeLeft(prevTime => prevTime - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else {
            setTimerActive(false);
        }
    }, [timeLeft, timerActive]);

    return (
        <div className="send-otp-container">
            <Row className='Row-container'>
                <Col md={6} className="otp-image-col">
                    <img src={otpimg} alt="OTP" className="otp-image" />
                </Col>
                <Col md={6} className="otp-form-col" style={{ marginLeft: "-98px" }}>
                    <div className="otp-form1">
                        <h1 className='head'>Verify OTP</h1>
                        <div className="otp-subheading">
                            Enter the OTP sent to your phone number: <strong>{phone}</strong>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="otp-input-container">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`otp-input${index + 1}`}
                                        type={showBullets[index] ? "password" : "text"} // Conditional input type
                                        value={digit}
                                        onChange={(e) => handleChange(e, index)}
                                        maxLength="1"
                                        className="otp-input" style={{backgroundColor:"#abacb8"}}
                                        ref={el => inputRefs.current[index] = el} // Set ref for each input
                                    />
                                ))}
                            </div>
                            <button type="submit" className="verify-button">Verify</button>
                            <p className='back-phonenumber'>
                                Back to <a href='/forgot-password'>Phone Number</a>
                            </p>
                            <p className="resend-note">
                                {timeLeft > 0 ? `Resend code in ${Math.floor(timeLeft / 60)}:${timeLeft % 60}` :
                                    <button className="resend-button" onClick={handleResendCode}>Resend OTP</button>}
                            </p>
                        </form>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default SendOTP;
