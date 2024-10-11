import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import curio from './Images/CurioCampus__1.png'
import "bootstrap/dist/css/bootstrap.min.css";
import development from "./Images/development.png";
import music from "./Images/music.png";
import dance from "./Images/dance.png";
import gaming from "./Images/gaming.png";
import art from "./Images/art.png";
import photograph from "./Images/photograph.png";
import creativity from "./Images/creativity.png";
import ui_ux from "./Images/ui_ux.png";
import "bootstrap-icons/font/bootstrap-icons.css";
import aboutusimg from "./Images/aboutusimg.jpg";
import online from './Images/onlineinteraction.png'
import {
  Button,
  Row,
  Col,
  Navbar,
  Container,
  Nav,
  Accordion,
  Form,
} from "react-bootstrap";
import Carousel from "react-bootstrap/Carousel";
import profileicon from "./Images/profileicon.png";
import { Link } from "react-scroll";
import "./MainScreen.css";
import { Swiper, SwiperSlide } from 'swiper/react';


import axios, { Axios } from "axios";

function MainScreen() {
  const [scrollToTop, setScrollToTop] = useState(true);
  const [username, setUsername] = useState("");
  const[profilepic,setProfilePicture]=useState("")
  const [profilePhoto, setProfilePhoto] = useState("");
  const [userInitials, setUserInitials] = useState("");
  let nav1 = useNavigate();
  let navigate = useNavigate();

  useEffect(() => {
    const storedUsername =  sessionStorage.getItem("username");

    const storedPhoto =  sessionStorage.getItem("userProfilePic");
    
    
    const storedInitials =  sessionStorage.getItem("userInitials");
  
    if (storedUsername) {
      setUsername(storedUsername);
      setProfilePhoto(storedPhoto || profileicon); 
      setUserInitials(storedInitials || userInitials); 
    }
  }, [navigate]);

 
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const phonenumber = sessionStorage.getItem('phonenumber');
        const gmail = sessionStorage.getItem('gmail');
        
        if (phonenumber) {
          console.log(phonenumber);
          
          const response = await axios.get(`http://49.204.232.254:90/users/getbyphonenumber/${phonenumber}`);
          const userData = response.data;
  
          console.log('API Response using phonenumber:', userData);
          
          if (userData.data.username) {
            setUsername(userData.data.username);
          } else {
            console.log('No username found');
          }
  
          if (userData.data.image && userData.data.image.length > 0) {
            const imageUrl = userData.data.image[0];
            if (imageUrl.startsWith('https://lh3.googleusercontent.com/')) {
              setProfilePicture(imageUrl); 
              console.log("Google Profile Picture:", imageUrl);
            } else {
              const fullImageUrl = `http://49.204.232.254:90/api/${imageUrl}`;
              setProfilePicture(fullImageUrl);
              console.log("Local Profile Picture:", fullImageUrl);
            }
          } else {
            console.log('No profile picture found');
          }
        } else if (gmail) {
          // Fetch user data by Gmail for subsequent logins
          const response = await axios.get(`http://49.204.232.254:90/users/getbyemail/${gmail}`);
          const userData = response.data;
  
          console.log('API Response using gmail:', userData);
  
          if (userData.data.username) {
            setUsername(userData.data.username);
          } else {
            console.log('No username found');
          }
  
          if (userData.data.image && userData.data.image.length > 0) {
            const imageUrl = userData.data.image[0];
            if (imageUrl.startsWith('https://lh3.googleusercontent.com/')) {
              setProfilePicture(imageUrl); 
              console.log("Google Profile Picture:", imageUrl);
            } else {
              const fullImageUrl = `http://49.204.232.254:90/api/${imageUrl}`;
              setProfilePicture(fullImageUrl);
              console.log("Local Profile Picture:", fullImageUrl);
            }
          } else {
            console.log('No profile picture found');
          }
        } else {
          console.log('No user info found in session storage');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchUserData();
  }, []);
  
  
 
  const scrollToPosition = (position) => {
    window.scrollTo({
      top: position,
      behavior: "smooth",
    });
  };

  const handleScrollToggle = () => {
    const currentPosition = window.pageYOffset;
    if (scrollToTop) {
      scrollToPosition(0);
    } else {
      scrollToPosition(document.body.scrollHeight);
    }
    setScrollToTop(!scrollToTop);
  };

  return (
    <>
    <div className="main-page">
      <Navbar expand="lg" className="sticky-navbar-ms" style={{position:"sticky"}}>
        <Container>
          <Navbar.Brand
            href="#home"
            style={{
              fontSize: "25px",
              color: "rgb(50, 50, 54)",
              fontWeight: "700",
            }}
          >
           <img src={curio}/>
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="slide-ms">
              <Link to="/home" className="nav-bar-ms">
                Home
              </Link>
              <Link to="/category" className="nav-bar1-ms">
                Category
              </Link>
              <Link to="/aboutus" className="nav-bar2-ms">
                About us
              </Link>
              <Link to="/contact" className="nav-bar3-ms">
                Contact
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
        <div style={{  alignItems: "center" }}>
        <img
  src={profilepic ? profilepic : profileicon}
  onClick={() => navigate("/ProfilePage")}

  className="profileimg-ms12"
/>
</div>
</Navbar>
</div>



      <div className="hero-section-ms" id="/home">
        <Row>
        <Col lg={6} className="content-col-ms">
              <p className="showusername-ms">Hello {username}...!</p>
              <p className="title-ms">Welcome to Curio Campus!</p>
              <p className="hero-description-ms">
                Curiosity ignites the path to access free skills, share knowledge,
                and build a thriving community. Cultivate curiosity by sharing your
                skills freely and watch new possibilities unfold.
              </p>
              <button
                className="share-button-ms"
                onClick={() => navigate("/Profilepage")}
              >
                Share Skill
              </button>
            </Col>
            <Col lg={6} className="image-col-ms">
              <img
                src={online} 
                alt="Skill"
                className="hero-image-ms"
              />
            </Col>
          </Row>

        
          </div>


        <div className="background-ms" id="/category">
        <p className="topcategories-ms">Top Categories</p>
        <Row>
          <Col lg={3}>
            <div className="card1-ms" onClick={() => nav1("/Development")}>
              <div className="devimg1-ms">
                <img
                  className="Development1-ms"
                  src={development}
                  alt="Development"
                />
              </div>
              <div className="dev1-ms">
                <p className="Fonts1-ms">Development</p>
              </div>
              <div className="card1__content-ms">
                <p className="card1__description-ms">
                Development is the process of designing a website to react to
                    user input or movement, such as with animations or
                    transitions.
                </p>
                <button variant="dark" className="button-ms12">Click Here</button>
              </div>
            </div>
          </Col>

          <Col lg={3}>
              <div className="card2-ms" onClick={() => navigate("/Music")}>
                <div className="musicimg1-ms">
                  <img className="Music-ms" src={music} alt="Music" />
                </div>
                <div className="music1-ms">
                  <p className="Fonts2-ms">Music</p>
                </div>
                <div className="card2__content-ms">
                  <p className="card2__description-ms">
                  The art of producing pleasing sounds is Music is the art of creating expressive combinations of sounds and harmony.
                  </p>
                  <button variant="dark" className="button-ms12">Click Here</button>

                </div>
              </div>
            </Col>

            <Col lg={3}>
              <div className="card3-ms" onClick={() => navigate("/Creativity")}>
                <div className="creatimg1-ms">
                  <img
                    className="creativity-ms"
                    src={creativity}
                    alt="Creativity"
                  />
                </div>
                <div className="creativity1-ms">
                  <p className="Fonts3-ms">Creativity</p>
                </div>
                <div className="card3__content-ms">
                  <p className="card3__description-ms">
                    Creativity is the ability to bring into existence something new,
                    whether a solution, a method, or a form.
                  </p>
                  <button variant="dark" className="button-ms12">Click Here</button>

                </div>
              </div>
            </Col>

            <Col lg={3}>
              <div className="card4-ms" onClick={() => navigate("/Art")}>
                <div className="artimg1-ms">
                  <img className="art-ms" src={art} alt="Art" />
                </div>
                <div className="art1-ms">
                  <p className="Fonts4-ms">Art</p>
                </div>
                <div className="card4__content-ms">
                  <p className="card4__description-ms">
                  Art is the expression of ideas and emotions through a physical medium,painting,sculpture,or printmaking.
                  </p>
                  <button variant="dark" className="button-ms12">Click Here</button>

                </div>
              </div>
            </Col>
          </Row>
      
        <Row>
          <Col lg={3}>
            <div className="card1-ms" onClick={() => navigate("/Dance")}>
              <div className="danceimg1-ms">
                <img className="dance-ms" src={dance} alt="Dance" />
              </div>
              <div className="dance1-ms">
                <p className="Fonts5-ms">Dance</p>
              </div>
              <div className="card1__content-ms">
                <p className="card1__description-ms">
                  Dance, the movement of the body in a rhythmic way, usually to
                  music and within a given space, for the purpose of expressing.
                  
                </p>
                <button variant="dark" className="button-ms12">Click Here</button>

              </div>
            </div>
          </Col>
          <Col lg={3}>
            <div className="card2-ms" onClick={() => navigate("/Photograph")}>
              <div className="photoimg1-ms">
                <img className="photo-ms" src={photograph} alt="Photography" />
              </div>
              <div className="photo1-ms">
                <p className="Fonts6-ms">Photograph</p>
              </div>
              <div className="card2__content-ms">
                <p className="card2__description-ms">
                  Photography is the art of creating images by recording light
                  with a camera and capture events,moments in time.
                </p>
                <button variant="dark" className="button-ms12">Click Here</button>

              </div>
            </div>
          </Col>
          <Col lg={3}>
            <div className="card3-ms" onClick={() => navigate("/Ui_Ux")}>
              <div className="uiuximg1-ms">
                <img className="uiux-ms" src={ui_ux} alt="UI-UX" />
              </div>
              <div className="uiux1-ms">
                <p className="Fonts7-ms">UI-UX</p>
              </div>
              <div className="card3__content-ms">
                <p className="card3__description-ms">
                  UI stands for "user interface" and refers to the visual
                  elements of a product, such as buttons, icons, and toggles.
      
                </p>
                <button variant="dark" className="button-ms12">Click Here</button>

              </div>
            </div>
          </Col>

          <Col lg={3}>
            <div className="card4-ms" onClick={() => navigate("/Gaming")}>
              <div className="gameimg-ms">
                <img className="gaming-ms" src={gaming} alt="Gaming" />
              </div>
              <div className="gaming1-ms">
                <p className="Fonts8-ms">Gaming</p>
              </div>
              <div className="card4__content-ms">
                <p className="card4__description-ms">
                  Gaming is the act of playing games, such as board games, card
                  games, or video games, on a variety of platforms.
                  
                </p>
                  <button variant="dark" className="button-ms12">Click Here</button>

              </div>
              </div>
              </Col>
              </Row>
        
       
        <div className="full-content" id="/aboutus">
          <Row className="row-contain">
            <p className="name1-ms">About Us</p>
            <Col lg={4} className="aboutus-text-col">
              <ul>
              <li className="slog1-ms">
              <p className="f1-ms">
                Welcome to Curio Campus, where we believe that knowledge is
                best shared through genuine interaction and personalized
                connection.
              </p>
            </li>
            <li className="slog2-ms">
              <p className="f1-ms">
                Our mission is to create a vibrant platform where
                individuals can exchange skills, learn from one another, and
                grow together.
              </p>
            </li>
          </ul>
        </Col>
        <Col lg={4} className="aboutus-img-col">
          <img src={aboutusimg} className="about-img-ms" alt="About Us" />
        </Col>
        <Col lg={4} className="aboutus-text-col">
          <ul>
            <li className="slog3-ms">
              <p className="f1-ms">
                Join this World Where we can Exchange the Skills for Free
                or Paid, through Video Chat, Chat, and Offline Videos.
              </p>
            </li>
            <li className="slog4-ms">
              <p className="f1-ms">
                At Curio Campus, we envision a world where learning and
                teaching are accessible and engaging for everyone.
              </p>
            </li>
          </ul>
        </Col>
      </Row>
      <Row className="faq-section">
        <Col lg={{ span: 10, offset: 1 }}>
          <h1 className="accord-head-ms">FREQUENTLY ASKED QUESTIONS</h1>
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="1" className="accor-head-ms">
              <Accordion.Header>What Is CurioCampus?</Accordion.Header>
              <Accordion.Body className="accord-body-ms">
                CurioCampus is your ultimate destination for engaging
                and interactive learning experiences. Whether you're
                passionate about mastering new skills, diving deep into
                fascinating subjects, or exploring new hobbies,
                CurioCampus offers a vast array of high-quality courses
                and resources tailored to your interests. You can learn
                at your own pace, anytime and anywhere, with no
                interruptions – all for a single affordable
                subscription. With a constantly growing library of
                diverse courses, you'll always find something new to
                explore.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2" className="accor-head-ms">
              <Accordion.Header>24/7 Hours Active</Accordion.Header>
              <Accordion.Body className="accord-body-ms">
                CurioCampus is your anytime, anywhere learning hub,
                available 24/7 on all your internet-connected devices.
                Whether you're looking to advance your career, pick up a
                new hobby, or dive into a subject you're passionate
                about, CurioCampus offers a vast selection of
                interactive courses and resources to fit your schedule.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="3" className="accor-head-ms">
              <Accordion.Header>
                Offline Videos are Available
              </Accordion.Header>
              <Accordion.Body className="accord-body-ms">
                CurioCampus is your ultimate learning destination,
                offering a rich library of courses and resources with
                the flexibility of offline access. Whether you're on the
                go or prefer studying without an internet connection,
                CurioCampus has you covered.
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
      </Row>
    </div> 
       

        <footer className="footer-ms">
          <div className="footer-container-ms" id="/contact">
            <div className="footer-section-ms">
              <h4>Flexible Time</h4>
              <p>
                Learn at your own pace with our flexible scheduling options.
                Access courses 24/7, anywhere, anytime.
              </p>
            </div>
            <div className="footer-section-ms">
              <h4>Skills Exchange</h4>
              <p>
                Join our community of learners and professionals to exchange
                skills, knowledge, and experiences.
              </p>
            </div>
            <div className="footer-section-ms">
              <h4>Free & Paid Courses</h4>
              <p>
                Explore a wide range of free and paid courses that suit your
                career goals and learning needs.
              </p>
            </div>
            <div className="footer-section-ms">
              <h4>Get In Touch</h4>
              <p>Email: curiocampus@gmail.com</p>
              <p>Phone: 6300145525</p>
              {/* <div className="icons">
                <a href="#">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#">
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a href="#">
                  <i className="fab fa-instagram"></i>
                </a>
              </div> */}
            </div>
       
          <div className="footer-bottom-ms">
            <p className="footer-para-ms">
              By continuing past this page, you agree to our Terms of Service,
              Cookie Policy, Privacy Policy and Content Policies. All trademarks
              are properties of their respective owners. 2024 © CurioCampus™
              Ltd. All rights reserved.
            </p>
          </div>
          </div>
        </footer>
    

      <button
        onClick={handleScrollToggle}
        className="scroll-bt"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "50px",
          height: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          fontSize: "30px",
        }}
      >
        {scrollToTop ? "↑" : "↓"}
      </button>
      </div>
    </>
  );
}

export default MainScreen;


