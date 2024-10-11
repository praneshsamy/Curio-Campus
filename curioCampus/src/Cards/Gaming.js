import React, { useEffect, useState } from 'react';
import './Gaming.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col, Card } from 'react-bootstrap';
import profile from '../Cards/Images/profileicon (2).png';
import art from '../Cards/Images/gamingpage.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import { MdVideoCall, MdOutlineVideoSettings } from 'react-icons/md';

function Gaming() {
  const [gamingUsers, setGamingUsers] = useState([]);
  const [experiences, setExperiences] = useState("");
  const [languages, setLanguages] = useState("");
  const [qualifications, setQualification] = useState("");
  const baseImageUrl = 'http://49.204.232.254:90/api'; 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGamingUsers = async () => {
      try {
        const response = await axios.get('http://49.204.232.254:90/users/getall');
        const users = response.data.data;

        
        const filteredUsers = users.filter(user =>
          user.skills.some(skill =>
            skill.skillname.toLowerCase() === 'gaming' && skill.status === 'Approved'
          )
        );

       
        const usersWithGamingSkill = filteredUsers.map(user => {
          const gamingSkill = user.skills.find(skill =>
            skill.skillname.toLowerCase() === 'gaming' && skill.status === 'Approved'
          );
          setExperiences(gamingSkill.experiences);
          setLanguages(gamingSkill.languages);
          setQualification(gamingSkill.qualifications);
          return {
            ...user, 
            skills: [gamingSkill] 
          };
        });

        setGamingUsers(usersWithGamingSkill);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchGamingUsers();
  }, []);

  const handleChatClick = () => {
    navigate('/chat');  
  };

  const handleVideoCallClick = () => {
    navigate('/video-call'); 
  };

  const handleOfflineVideoClick = (phonenumber) => {
    
    navigate(`/offline`, { state: { phonenumber } });  
  };

  return (
    <div>
      <div className='gambackground'>
        <p className='gamnav'>Gaming</p>
      </div>

      <div style={{ backgroundColor: "#061b30", height: "fit-content" }}>
        <Row>
          <Col lg={6}>
            <img src={art} style={{ width: "80%", marginLeft: "650px", marginTop: "80px" }} alt="Gaming" />
          </Col>
          <Col lg={6}>
            <li className='gamline1'>Gaming is the act of playing an electronic video game, which can be done on a variety of platforms.</li>
            <li className='gamline2'>Gaming can be used for entertainment, relaxation, competitions, and computer learning.</li>
            <li className='gamline3'>The gaming industry is considered one of the most exciting in tech because of its importance to culture, entertainment, and technological advancement.</li>
          </Col>
        </Row>

     
        <Row className="g-4"> 
          {gamingUsers.map((user, index) => (
            <Col lg={3} key={index} style={{width:"23%",marginLeft:"20px",paddingBottom:"50px",marginTop:"50px"}}>
              <Card className={`dancard1${index + 1}`}  style={{paddingTop:"10px",paddingBottom:"10px"}}>
                <Card.Title style={{ display: "flex", justifyContent: "center" }}>
                  <img className='profile-pic-up'
                    src={
                      user.image.length > 0 && typeof user.image[0] === 'string' && user.image[0].startsWith("https://lh3.googleusercontent.com")
                        ? user.image[0]
                        : user.image.length > 0
                          ? `${baseImageUrl}${user.image[0]}`
                          : profile
                    } 
                    alt={`${user.username}'s Profile`} 
                    style={{ width: "35%", display: "block", margin: "0px" }} 
                  />
                </Card.Title>
                <Card.Text>
                  <p className='gamtext1'>{user.username}</p>
                  <p className='gamtext3'>{user.skills.length > 0 ? user.skills[0].skillname : 'No Skills Listed'}</p>
                  <p className='devtext1'>{experiences || 'No Experiences'}</p>
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
        </Row>
      </div>
    </div>
  );
}

export default Gaming;
