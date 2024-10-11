import React, { useEffect, useState } from 'react';
import './Ui_Ux.css'; // Ensure to use appropriate CSS for styling
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col, Card } from 'react-bootstrap';
import art from '../Cards/Images/ui-uxpage.png'; // UI/UX Image
import axios from 'axios';
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import { MdVideoCall, MdOutlineVideoSettings } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

function Ui_Ux() {
  const [uiuxUsers, setUiuxUsers] = useState([]);
  const [Experiences, setExperiences] = useState("");
  const [languages, setLanguages] = useState("");
  const [qualifications, setqualification] = useState("");
  const baseImageUrl = 'http://49.204.232.254:90/api';
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUiuxUsers = async () => {
      try {
        const response = await axios.get('http://49.204.232.254:90/users/getall');
        const users = response.data.data;
        const filteredUsers = users.filter(user =>
          user.skills.some(skill =>
            skill.skillname.toLowerCase() === 'uiux' && skill.status === 'Approved'
          )
        );
        console.log(filteredUsers);
        const usersWithUiuxSkill = filteredUsers.map(user => {
          const uiuxSkill = user.skills.find(skill =>
            skill.skillname.toLowerCase() === 'uiux' && skill.status === 'Approved'
          );
          setExperiences(uiuxSkill.experiences);
          setLanguages(uiuxSkill.languages);
          setqualification(uiuxSkill.qualifications);
          return {
            ...user,
            skills: [uiuxSkill]
          };
        });

        setUiuxUsers(usersWithUiuxSkill);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUiuxUsers();
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
      <div className='uibackground'>
        <p className='uinav'>UI/UX</p>
      </div>
      <div style={{ backgroundColor: "#061b30", height: "fitcontent" }}>
        <Row>
          <Col lg={6}>
            <img src={art} style={{ width: "80%", marginLeft: "650px", marginTop: "0px" }} alt="UI/UX Design" />
          </Col>
          <Col lg={6}>
            <li className='uiline1'>UI design is the process of creating the visual layout and interactive elements of a product, such as buttons, icons, and menus.</li>
            <li className='uiline2'>UX design, on the other hand, encompasses the overall experience a user has when interacting with a product or service.</li>
            <li className='uiline3'>Both UI and UX design are crucial for creating effective digital experiences, and their impact can vary based on individual user preferences and context.</li>
          </Col>
        </Row>

       
        <Row>
          {uiuxUsers.map((user, index) => (
            <Col lg={3} key={index} style={{width:"23%",marginLeft:"20px",paddingBottom:"50px",marginTop:"50px"}}> {/* Add margin-bottom for spacing */}
              <Card className={`uicard1${index + 1}`}  style={{paddingTop:"10px",paddingBottom:"10px"}}>
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
                  <p className='uitext1'>{user.username}</p>
                  <p className='uitext3'>{user.skills.length > 0 ? user.skills[0].skillname : 'No Skills Listed'}</p>
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

export default Ui_Ux;
