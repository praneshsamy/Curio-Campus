import React, { useEffect, useState, } from 'react';
import './Development.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col, Card } from 'react-bootstrap';
import devimage from '../Cards/Images/development-growth-progress-icon-concept.jpg';
import axios from 'axios';
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import { MdVideoCall, MdOutlineVideoSettings } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { Language } from '@mui/icons-material';

function Development() {
  const [devUsers, setDevUsers] = useState([]);
  const [Experiences, setExperiences] = useState("")
  const [languages, setLanguages] = useState("")
  const [qualifications, setqualification] = useState("")
  const baseImageUrl = 'http://49.204.232.254:90/api';  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDevUsers = async () => {
      try {
        const response = await axios.get('http://49.204.232.254:90/users/getall');
        const users = response.data.data;
        console.log("Fetched Users:", users); 


        const filteredUsers = users.filter(user =>
          user.skills.some(skill =>
            (skill.skillname.toLowerCase() === 'devlopement' || skill.skillname.toLowerCase() === 'developement') && skill.status === 'Approved'
          )
        );


        const usersWithDevelopmentSkill = filteredUsers.map(user => {
          const devSkill = user.skills.find(skill =>
            (skill.skillname.toLowerCase() === 'devlopement' || skill.skillname.toLowerCase() === 'developement') && skill.status === 'Approved'
          );
          
          
          setExperiences(devSkill.experiences)
         
          
          setLanguages(devSkill.languages)
          setqualification(devSkill.qualifications)
          return {
            ...user,
            skills: [devSkill]
          };
        });

        setDevUsers(usersWithDevelopmentSkill);

      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchDevUsers();
  }, []);

  const handleChatClick = () => {
    navigate('/chat');  
  };

  const handleVideoCallClick = () => {
    navigate('/video-call');  
  };

  const handleOfflineVideoClick = (phonenumber) => {
    console.log("Clicked user's phone number:", phonenumber);  
  
    navigate(`/offline`, { state: { phonenumber } }); 
  };
  

  return (
    <div>
      <div className='devbackground'>
        <p className='devnav'>Development</p>
      </div>
      <div style={{ backgroundColor: "#061b30", height: "fitcontent" }}>
        <Row>
          <Col lg={6}>
            <img src={devimage} style={{ width: "80%", marginLeft: "650px", marginTop: "30px" }} alt="Development" />
          </Col>
          <Col lg={6}>
            <li className='devline1'>HTML/CSS and JavaScript Mastery are essential for structuring content, creating styles, and enabling dynamic interactivity.</li>
            <li className='devline2'>Responsive Design ensures the website adapts seamlessly to various devices and screen sizes.</li>
            <li className='devline3'>Frameworks and Libraries such as React, Angular, or Vue.js are used for efficient and modular component development.</li>
          </Col>
        </Row>
        <div className='tt'>
         
          <Row>
            {devUsers.map((user, index) => (
              <Col lg={3} key={index} style={{width:"23%",marginLeft:"20px",paddingBottom:"50px",marginTop:"50px"}}>
                <Card className={`devcard${index + 1}`} style={{paddingTop:"10px",paddingBottom:"10px"}}>

                  <Card.Title style={{ display: "flex", justifyContent: "center" }}>
                    <img className='profile-pic-up'
                      src={
                        user.image.length > 0 && typeof user.image[0] === 'string' && user.image[0].startsWith("https://lh3.googleusercontent.com")
                          ? user.image[0]
                          : user.image.length > 0
                            ? `${baseImageUrl}${user.image[0]}`
                            : 'fallback-image-url'
                      }
                      style={{ width: "35%", display: "block", margin: "0 auto" }}
                      alt={`${user.username}'s Profile`}
                    />
                  </Card.Title>
                  <Card.Text>
                    <p className='devtext1'>{user.username || 'No Username'}</p>


                    <p className='devtext3'>
                      {user.skills.length > 0 ? user.skills[0].skillname : 'No Skills Listed'}
                    </p>
                    <p className='devtext1'>{Experiences || 'No Experiences'}</p>
                    <p className='devtext1'>{qualifications || 'No Qualifications'}</p>

                    <p className='devtext1'>{languages || 'No Languages'}</p>

                  </Card.Text>

                  <div className="social-icons-up">
                    <IoChatbubbleEllipsesOutline
                      className="chat-up"
                      onClick={handleChatClick}  
                    />
                    <MdVideoCall
                      className="video-up"
                      onClick={handleVideoCallClick}  
                    />
                    <MdOutlineVideoSettings
                      className="record-up"
                      onClick={() => handleOfflineVideoClick(user.phonenumber)}  
                    />
                  </div>
                </Card>

              </Col>
            ))}
            {""}
          </Row>
        </div>

      </div>

    </div>
  );
}

export default Development;
