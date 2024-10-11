import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { Row, Col, Navbar, Container, Carousel } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Firstpage.css";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';
import image1 from '../Startpage/Images/livechat.jpeg'
import image2 from '../Startpage/Images/recordedvideos.jpg'
import image3 from '../Startpage/Images/videochat.jpeg';
import im from '../UserProfile/pro.jpg';
import curio from './Images/CurioCampus__1.png'
import { Pagination, Navigation, EffectCoverflow } from 'swiper/modules';
import StarRatings from "react-star-ratings";

function FirstPage() {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 60000);
    }, 9000);

    return () => clearInterval(intervalId);
  }, []);

  const handleViewProfile = () => {
    Swal.fire({
      title: "Proceed to Sign up",
      text: "You need to sign up to view the profile.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "sign up",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/Signup", { state: { fromProfileCard: true } });
      }
    });
  };

  return (
<div className="full-back">
    <div className="startup-width">
      <Navbar expand="lg" className="sticky-navbar12" style={{position: "sticky", top: 0, zIndex: 1000}} >
        <Container>
        <Navbar.Brand
            href="#home"
            style={{
              marginLeft:"-30px",
              fontSize: "25px",
              color: "rgb(50, 50, 54)",
              fontWeight: "700",
            }}
          >
           <img src={curio} style={{marginLeft:"30px"}}/>
          </Navbar.Brand>
         
        </Container>
        <div style={{ width: "110px", marginLeft: "-90px" }}>
          <Link to="/login">
            <button className="buttonlogin5">Login</button>
          </Link>
        </div>
        <div style={{ width: "110px" }}>
          <Link to="/signup">
            <button className="buttonlogin6">Sign up</button>
          </Link>
        </div>
      </Navbar>

      {showPopup && (
        <div className="popup-message">
          <div className="popup-content">
            <h4>Join Us Now!</h4>
            <p>Sign up to access exclusive features and content.</p>
            <div className="popup-buttons">
              <Link to="/signup">
                <button className="btn btn-secondary">Sign Up</button>
              </Link>
              <button
                className="btn btn-secondary"
                onClick={() => setShowPopup(false)}
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
<Container>
<p style={{textAlign:"center",fontWeight:"600",fontSize:"50px",color:"white",marginTop:"150px"}}>Transform Knowledge into Action : Share Your Skills and Grow Together!"  </p>


<Row>

  <Col lg={4}>

    <div className="full-content-up4">
      <div className="full-body-up2">
        <div className="profile-side-up2">
          <img src={im} className="profile-pic-up2" alt="profile" />
          <h2 className="profile-name-up2">Pranesh</h2>
          <h4 className="profile-role-up2">Web Developer</h4>
        </div>
        <div className="right-side-up2">
          <h3 className="info-row-up2">Experience</h3>
          <p className="info-value-up2">3 years.</p>
          <h3 className="info-row-up2">Languages</h3>
          <p className="info-value-up2">Tamil, English.</p>
          <h3 className="info-row-up2">Qualifications</h3>
          <p className="info-value-up2">DevOps Engineer, Masters.</p>
           <button onClick={handleViewProfile} className="bt-pro1">
                    View Profile
                  </button>              
        </div>
      </div>
    </div>
  </Col>
  <Col lg={4}>
    
      <div className="full-body-up2">
        <div className="profile-side-up2">
          <img src={im} className="profile-pic-up2" alt="profile" />
          <h2 className="profile-name-up2">Manoj</h2>
          <h4 className="profile-role-up2">Web Developer</h4>
        </div>
        <div className="right-side-up2">
          <h3 className="info-row-up2">Experience</h3>
          <p className="info-value-up2">2 years.</p>
          <h3 className="info-row-up2">Languages</h3>
          <p className="info-value-up2">English.</p>
          <h3 className="info-row-up2">Qualifications</h3>
          <p className="info-value-up2">MS,Developer,4year Experience</p>
          <button onClick={handleViewProfile} className="bt-pro1">
                    View Profile
                  </button>              
        </div>
      </div>
    
  </Col>
  <Col lg={4}>
   
      <div className="full-body-up3">
        <div className="profile-side-up3">
          <img src={im} className="profile-pic-up3" alt="profile" />
          <h2 className="profile-name-up3">Pranesh</h2>
          <h4 className="profile-role-up3">Web Developer</h4>
        </div>
        <div className="right-side-up3">
          <h3 className="info-row-up3">Experience</h3>
          <p className="info-value-up3">3 years.</p>
          <h3 className="info-row-up3">Languages</h3>
          <p className="info-value-up3">Tamil, English.</p>
          <h3 className="info-row-up3">Qualifications</h3>
          <p className="info-value-up3">DevOps Engineer, Masters.</p>
          <button onClick={handleViewProfile} className="bt-pro1">
                    View Profile
                  </button>              
        </div>
      </div>
   
  </Col>
</Row>


<div className="feature-slider-SP">
  <Swiper
    modules={[Pagination, Navigation, EffectCoverflow]}
    spaceBetween={30}
    slidesPerView={3}
    loop={true}
    navigation
    pagination={{ clickable: true }}
    centeredSlides={true}
    initialSlide={2}
    effect="coverflow"
    coverflowEffect={{
      rotate: 0,
      stretch: 0,
      depth: 200,
      modifier: 1,
      slideShadows: false,
    }}
    breakpoints={{
      640: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    }}
  >
    <SwiperSlide>
      <div className="card-SP">
        <img src={image1} alt="Live Chat" className="card-img-SP" />
        <div className="card-content-SP">
          <h3>Live Chat</h3>
          <p>Stuck on a project Our mentors are here to help just a message away. Chat with peers and experts while you learn collaboration made easy</p>
        </div>
      </div>
    </SwiperSlide>
    <SwiperSlide>
      <div className="card-SP">
        <img src={image2} alt="Recorded Videos" className="card-img-SP" />
        <div className="card-content-SP">
          <h3>Recorded Videos</h3>
          <p>Your learning, your pace access a treasure trove of skill building videos anytime. Dive into expert led tutorials that inspire creativity and mastery</p>
        </div>
      </div>
    </SwiperSlide>
    <SwiperSlide>
      <div className="card-SP">
        <img src={image3} alt="Video Chat" className="card-img-SP" />
        <div className="card-content-SP">
          <h3>Video Chat</h3>
          <p>Learn directly from experts face-to-face, wherever you are from art lessons to coding bootcamps unlock new skills in real-time.</p>
        </div>
      </div>
    </SwiperSlide>
  </Swiper>
</div>
</Container>

</div>
      <footer>
        <section className="footer">
          <div className="footer-row">
            <div className="footer-col">
              <h2 className="curiocampus">CurioCampus</h2>
              <h4 className="newsletter">Info</h4>
              <ul className="links">
                <li>
                  <a href="#">About Us</a>
                </li>
                <li>
                  <a href="#">Compressions</a>
                </li>
                <li>
                  <a href="#">Customers</a>
                </li>
                <li>
                  <a href="#">Service</a>
                </li>
                <li>
                  <a href="#">Collection</a>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="newsletter">Explore</h4>
              <ul className="links">
                <li>
                  <a href="#">Free Designs</a>
                </li>
                <li>
                  <a href="#">Latest Designs</a>
                </li>
                <li>
                  <a href="#">Themes</a>
                </li>
                <li>
                  <a href="#">Popular Designs</a>
                </li>
                <li>
                  <a href="#">Art Skills</a>
                </li>
                <li>
                  <a href="#">New Uploads</a>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="newsletter">Legal</h4>
              <ul className="links">
                <li>
                  <a href="#">Customer Agreement</a>
                </li>
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
                <li>
                  <a href="#">Security</a>
                </li>
                <li>
                  <a href="#">Testimonials</a>
                </li>
                <li>
                  <a href="#">Media Kit</a>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Newsletter</h4>
              <p>
                Subscribe to our newsletter for a weekly dose of news, updates,
                helpful tips, and exclusive offers.
              </p>
              <form action="#">
                <input type="text" placeholder="Your email" required />
                <button type="submit">SUBSCRIBE</button>
              </form>
              <div className="icons">
                <i className="fa-brands fa-facebook-f"></i>
                <i className="fa-brands fa-linkedin"></i>
                <i className="fa-brands fa-github"></i>
                <i className="fa-brands fa-instagram"></i>
                <i className="fa-brands fa-threads"></i>
              </div>
            </div>
          </div>
          <div>
            <p className="copyrights">
              By continuing past this page, you agree to our Terms of Service,
              Cookie Policy, Privacy Policy and Content Policies. All trademarks
              are properties of their respective owners. 2024 © CurioCampus™
              Ltd. All rights reserved.
            </p>
          </div>
        </section>
      </footer>
    </div>
  );
}

export default FirstPage;