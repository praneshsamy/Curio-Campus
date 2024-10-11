import React, { useEffect, useState } from 'react';
import './MusicPage.css'; // Ensure this includes both music and development styles
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col, Card } from 'react-bootstrap';
import musicImage from '../Cards/Images/Musicpage.png';
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import { MdVideoCall, MdOutlineVideoSettings } from 'react-icons/md';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Music() {
  const [musicUsers, setMusicUsers] = useState([]);
  const [Experiences, setExperiences]= useState("");
  const [languages, setLanguages]=useState("");
  const [qualifications, setQualification]=useState("");
  const baseImageUrl = 'http://49.204.232.254:90/api'; 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMusicUsers = async () => {
      try {
        const response = await axios.get('http://49.204.232.254:90/users/getall');
        const users = response.data.data;

        const filteredUsers = users.filter(user =>
          user.skills.some(skill =>
            (skill.skillname.toLowerCase() === 'music' || skill.skillname.toLowerCase() === 'musician') && skill.status === 'Approved'
          )
        );

        const usersWithMusicSkill = filteredUsers.map(user => {
          const musicSkill = user.skills.find(skill =>
            (skill.skillname.toLowerCase() === 'music' || skill.skillname.toLowerCase() === 'musician') && skill.status === 'Approved'
          );
          setExperiences(musicSkill.experiences);
          setLanguages(musicSkill.languages);
          setQualification(musicSkill.qualifications);
          return {
            ...user,
            skills: [musicSkill],
          };
        });

        setMusicUsers(usersWithMusicSkill);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchMusicUsers();
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
        <p className='devnav'>Music</p>
      </div>
      <div style={{ backgroundColor: "#061b30", height: "fit-content" }}>
        <Row>
          <Col lg={6}>
            <img src={musicImage} style={{ width: "80%", marginLeft: "650px", marginTop: "30px" }} alt="Music" />
          </Col>
          <Col lg={6}>
            <li className='devline1'>Music is a universal language that connects people across time and space through its rhythm, melody, and harmony.</li>
            <li className='devline2'>It has the power to evoke emotions, tell stories, and capture the essence of human experience.</li>
            <li className='devline3'>Music reflects the diverse influences and creative expressions of artists from around the world.</li>
          </Col>
        </Row>

       
        <Row className="g-4"> 
          {musicUsers.map((user, index) => (
            <Col lg={3} key={index} style={{width:"23%",marginLeft:"20px",paddingBottom:"50px",marginTop:"50px"}}>
              <Card className={`muscard${index + 6}`} style={{paddingTop:"10px",paddingBottom:"10px"}}>
                <Card.Title stylemuscard={{ justifyContent: "center" }}>
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
                  <p className='devtext1'>{user.username}</p>
                  <p className='devtext3'>{user.skills.length > 0 ? user.skills[0].skillname : 'No Skills Listed'}</p>
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

export default Music;
