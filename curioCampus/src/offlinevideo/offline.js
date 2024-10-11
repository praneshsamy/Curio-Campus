import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { Container, Row, Col } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import './offline.css';

function UserIntro() {
    const [videos, setVideos] = useState([]);
    const location = useLocation();
    const phoneNumber = location.state?.phonenumber;

    useEffect(() => {
        const fetchUserVideos = async () => {
            if (!phoneNumber) {
                console.log("No phone number provided");
                return;
            }

            try {
                const response = await fetch(`http://49.204.232.254:90/videos/get/${phoneNumber}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log(data);
                
                const userVideos = data.videos.map(video => ({
                    videoUrl: video.video,
                    videoName: video.videoName,
                    description: video.description,
                    duration: video.duration,
                }));
                setVideos(userVideos);
            } catch (error) {
                console.error('Error fetching user videos:', error);
            }
        };

        if (phoneNumber) {
            fetchUserVideos();
        }
    }, [phoneNumber]);

    return (
        <div className="backgroundoff">
            <Container>
                <Row className="video-containeroff">
                    {videos.length === 0 ? (
                        <Col className="text-center">
                            <p>No videos available for this user.</p>
                        </Col>
                    ) : (
                        videos.map((videoData, index) => (
                            <Col md={4} sm={6} key={index} className="mb-4">
                                <div className="video-cardoff">
                                    <ReactPlayer
                                        url={`http://49.204.232.254:90${videoData.videoUrl}`}
                                        width="100%"
                                        height="150px"
                                        controls={true}
                                    />
                                    <div className="video-detailsoff">
                                        <h5 className="card-titleoff">{videoData.videoName || 'Untitled Video'}</h5>
                                        <p>{videoData.description || 'No description available'}</p>
                                        <p><strong>Duration:</strong> {videoData.duration} seconds</p>
                                    </div>
                                </div>
                            </Col>
                        ))
                    )}
                </Row>
            </Container>
        </div>
    );
}

export default UserIntro;
