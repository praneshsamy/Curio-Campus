import React, { useEffect, useState } from 'react';
import './Photograph.css'; // Assuming you have a CSS file for Photography component
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col, Card } from 'react-bootstrap';
import profile from '../Cards/Images/profileicon (2).png'; // Default profile image
import art from '../Cards/Images/photographypage.png'; // Background image for Photography
import axios from 'axios';
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import { MdVideoCall, MdOutlineVideoSettings } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

function Photograph() {
  const [photographyUsers, setPhotographyUsers] = useState([]);
  const [Experiences, setExperiences] = useState("");
  const [languages, setLanguages] = useState("");
  const [qualifications, setQualification] = useState("");
  const baseImageUrl = 'http://49.204.232.254:90/api'; 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPhotographyUsers = async () => {
      try {
        const response = await axios.get('http://49.204.232.254:90/users/getall');
        const users = response.data.data;

        const filteredUsers = users.filter(user =>
          user.skills.some(skill =>
            skill.skillname.toLowerCase() === 'photography' && skill.status === 'Approved'
          )
        );

        const usersWithPhotographySkill = filteredUsers.map(user => {
          const photographySkill = user.skills.find(skill =>
            skill.skillname.toLowerCase() === 'photography' && skill.status === 'Approved'
          );
          setExperiences(photographySkill.experiences);
          setLanguages(photographySkill.languages);
          setQualification(photographySkill.qualifications);
          return {
            ...user, 
            skills: [photographySkill] 
          };
        });

        setPhotographyUsers(usersWithPhotographySkill);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchPhotographyUsers();
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
      <div className='phobackground'>
        <p className='phonav'>Photography</p>
      </div>
      <div style={{ backgroundColor: "#061b30", height: "fit-content" }}>
        <Row>
          <Col lg={6}>
            <img src={art} style={{ width: "80%", marginLeft: "650px", marginTop: "30px" }} alt="Photography" />
          </Col>
          <Col lg={6}>
            <li className='pholine1'>Photography is the art and practice of capturing light to create images, whether through traditional film or digital means.</li>
            <li className='pholine2'>Photography can be understood as a visual medium that documents reality, expresses artistic vision, or both.</li>
            <li className='pholine3'>The meaning and impact of a photograph can vary widely among viewers, as it often reflects personal interpretations and cultural contexts.</li>
          </Col>
        </Row>

        <Row className="g-4"> 
          {photographyUsers.map((user, index) => (
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
                    style={{ width: "35%", display: "block", margin: "0 auto" }}
                    alt={`${user.username}'s Profile`}
                  />
                </Card.Title>
                <Card.Text>
                  <p className='photext1'>{user.username}</p>
                  <p className='photext3'>{user.skills.length > 0 ? user.skills[0].skillname : 'No Skills Listed'}</p>
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
        </Row>
      </div>
    </div>
  );
}

export default Photograph;
