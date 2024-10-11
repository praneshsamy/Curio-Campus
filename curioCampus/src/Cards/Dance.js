import React, { useEffect, useState } from 'react';
import './Dance.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col, Card } from 'react-bootstrap';
import art from '../Cards/Images/dancepage.jpg';
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import { MdVideoCall, MdOutlineVideoSettings } from 'react-icons/md';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dance() {
  const [danceUsers, setDanceUsers] = useState([]);
  const [Experiences, setExperiences] = useState("");
  const [languages, setLanguages] = useState("");
  const [qualifications, setqualification] = useState("");
  const baseImageUrl = 'http://49.204.232.254:90/api';  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDanceUsers = async () => {
      try {
        const response = await axios.get('http://49.204.232.254:90/users/getall');
        const users = response.data.data;

        const filteredUsers = users.filter(user =>
          user.skills.some(skill =>
            (skill.skillname.toLowerCase() === 'dance') && skill.status === 'Approved'
          )
        );
        const usersWithDanceSkill = filteredUsers.map(user => {
          const danceSkill = user.skills.find(skill =>
            skill.skillname.toLowerCase() === 'dance' && skill.status === 'Approved'
          );
          setExperiences(danceSkill.experiences);
          setLanguages(danceSkill.languages);
          setqualification(danceSkill.qualifications);
          return {
            ...user, 
            skills: [danceSkill] 
          };
        });

        setDanceUsers(usersWithDanceSkill);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchDanceUsers();
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
      <div className='danbackground'>
        <p className='dannav'>Dance</p>
      </div>

      <div style={{ backgroundColor: "#061b30", height: "fitcontent" }}>
        <Row>
          <Col lg={6}>
            <img src={art} style={{ width: "80%", marginLeft: "650px", marginTop: "30px" }} alt="Dance" />
          </Col>
          <Col lg={6}>
            <li className='danline1'>Dance is the art of movement expressed through the body, typically performed to music.</li>
            <li className='danline2'>Dance can be seen as a physical manifestation of creativity and emotion.</li>
            <li className='danline3'>The interpretation and impact of dance vary widely among audiences.</li>
          </Col>
        </Row>

        <Row>
          {danceUsers.map((user, index) => (
            <Col lg={3} style={{width:"23%",marginLeft:"20px",paddingBottom:"50px",marginTop:"50px"}}> {/* Add margin-bottom for spacing */}
              <Card className={`dancard1${index + 1}`}  style={{paddingTop:"10px",paddingBottom:"10px"}}>
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
                  <p className='dantext1'>{user.username}</p>
                  <p className='dantext3'>{user.skills.length > 0 ? user.skills[0].skillname : 'No Skills Listed'}</p>
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

export default Dance;
