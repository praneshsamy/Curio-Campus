import React, { useEffect, useState } from 'react';
import './Art.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col, Card } from 'react-bootstrap';
import profile from '../Cards/Images/profileicon (2).png';
import art from '../Cards/Images/Artpage.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import { MdVideoCall, MdOutlineVideoSettings } from 'react-icons/md';

function Art() {
  const [artUsers, setArtUsers] = useState([]);
  const [Experiences, setExperiences] = useState("");
  const [languages, setLanguages] = useState("");
  const [qualifications, setqualification] = useState("");
  const navigate = useNavigate(); 
  const baseImageUrl = 'http://49.204.232.254:90/api'; 

  useEffect(() => {
    const fetchArtUsers = async () => {
      try {
        const response = await axios.get('http://49.204.232.254:90/users/getall');
        const users = response.data.data;

        const filteredUsers = users.filter(user =>
          user.skills.some(skill =>
            skill.skillname.toLowerCase() === 'art' && skill.status === 'Approved'
          )
        );

        const usersWithArtSkill = filteredUsers.map(user => {
          const artSkill = user.skills.find(skill =>
            skill.skillname.toLowerCase() === 'art' && skill.status === 'Approved'
          );
          setExperiences(artSkill.experiences);
          setLanguages(artSkill.languages);
          setqualification(artSkill.qualifications);
          return {
            ...user, 
            skills: [artSkill] 
          };
        });

        setArtUsers(usersWithArtSkill);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchArtUsers();
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
      <div className='artbackground'>
        <p className='artnav'>Art</p>
      </div>

      <div style={{ backgroundColor: "#061b30", height: "fit-content" }}>
        <Row>
          <Col lg={6} className="d-flex align-items-center">
            <img src={art} alt="Art" className="artimg" style={{ width: "80%", marginLeft: "650px", marginTop: "30px" }} />
          </Col>
          <Col lg={6}>
            <ul>
              <li className='artline1'>Art is the expression of ideas and emotions through a physical medium, such as painting, sculpture, film, dance, writing, photography, or theater.</li>
              <li className='artline2'>Art can also be defined as a visual object or experience that is consciously created through an expression of skill or imagination.</li>
              <li className='artline3'>Art can be interpreted differently by different people, and there is no generally agreed definition of what constitutes art.</li>
            </ul>
          </Col>
        </Row>

        
        <Row>
          {artUsers.map((user, index) => (
            <Col lg={3} key={index} style={{width:"23%",marginLeft:"20px",paddingBottom:"50px",marginTop:"50px"}}> {/* Add margin-bottom for spacing */}
              <Card className={`artcard1${index + 1}`}  style={{paddingTop:"10px",paddingBottom:"10px"}}>
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
                  <p className='arttext1'>{user.username}</p>
                  <p className='arttext3'>{user.skills.length > 0 ? user.skills[0].skillname : 'No Skills Listed'}</p>
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

export default Art;
