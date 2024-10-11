import React, { useEffect, useState } from 'react';
import './Creativity.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col, Card } from 'react-bootstrap';
import profile from '../Cards/Images/profileicon (2).png';
import art from '../Cards/Images/creativitypage.png';
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import { MdVideoCall, MdOutlineVideoSettings } from 'react-icons/md';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Creativity() {
  const [creativityUsers, setCreativityUsers] = useState([]);
  const [Experiences, setExperiences] = useState("");
  const [languages, setLanguages] = useState("");
  const [qualifications, setQualification] = useState("");
  const baseImageUrl = 'http://49.204.232.254:90/api';
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCreativityUsers = async () => {
      try {
        const response = await axios.get('http://49.204.232.254:90/users/getall');
        const users = response.data.data;

        const filteredUsers = users.filter(user =>
          user.skills.some(skill =>
            skill.skillname.toLowerCase() === 'creativity' && skill.status === 'Approved'
          )
        );

        const usersWithCreativitySkill = filteredUsers.map(user => {
          const creativitySkill = user.skills.find(skill =>
            skill.skillname.toLowerCase() === 'creativity' && skill.status === 'Approved'
          );
          setExperiences(creativitySkill.experiences);
          setLanguages(creativitySkill.languages);
          setQualification(creativitySkill.qualifications);
          return {
            ...user,
            skills: [creativitySkill] 
          };
        });

        setCreativityUsers(usersWithCreativitySkill);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchCreativityUsers();
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
      <div className='creativity-background'>
        <p className='creativity-nav'>Creativity</p>
      </div>
      <div style={{ backgroundColor: "#061b30", height: "fit-content" }}>
        <Row>
          <Col lg={6}>
            <img src={art} style={{ width: "70%", marginLeft: "670px", marginTop: "0px" }} alt="Creativity" />
          </Col>
          <Col lg={6}>
            <li className='creativity-line1'>Creativity can be expressed in countless ways across various forms of art and design.</li>
            <li className='creativity-line2'>Whether you’re creating visual art, designing a user interface, or developing a new concept, the essence of creativity often lies in how you approach.</li>
            <li className='creativity-line3'>Creativity is defined as the tendency to generate or recognize ideas, alternatives, or possibilities that may be useful in solving problems.</li>
          </Col>
        </Row>

        <Row>
          {creativityUsers.map((user, index) => (
            <Col lg={3} key={index} style={{width:"23%",marginLeft:"20px",paddingBottom:"50px",marginTop:"50px"}}> {/* Add mb-4 for margin-bottom */}
              <Card className={`creativity-card1${index + 1}`} style={{paddingTop:"10px",paddingBottom:"10px"}}>
                <Card.Title style={{ display: "flex", justifyContent: "center" }}>
                  <img className='profile-pic-up'
                    src={
                      user.image.length > 0 && typeof user.image[0] === 'string' && user.image[0].startsWith("https://lh3.googleusercontent.com")
                        ? user.image[0] 
                        : user.image.length > 0
                          ? `${baseImageUrl}${user.image[0]}`
                          : profile 
                    }
                    style={{ width: "35%", display: "block", margin: "0 auto" }}
                    alt={`${user.username}'s Profile`}
                  />
                </Card.Title>
                <Card.Text>
                  <p className='creativity-text1'>{user.username}</p>
                  <p className='creativity-text3'>{user.skills.length > 0 ? user.skills[0].skillname : 'No Skills Listed'}</p>
                  <p className='creativity-text1'>{Experiences || 'No Experiences'}</p>
                  <p className='creativity-text1'>{qualifications || 'No Qualifications'}</p>
                  <p className='creativity-text1'>{languages || 'No Languages'}</p>
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
        </Row>
      </div>
    </div>
  );
}

export default Creativity;
