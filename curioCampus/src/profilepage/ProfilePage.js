
import React, { useState, useEffect } from "react";
import "./profilepage.css";
import ava from "../profilepage/profileImages/avater (1).jpg";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Swal from "sweetalert2";
import axios from "axios";

function ProfilePage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phonenumber: "",
    image: [],
    skills: [],
  });

  const [showShareSkillForm, setShowShareSkillForm] = useState(false);
  const [showUploadVideoForm, setShowUploadVideoForm] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [profilepic, setProfilePicture] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phonenumber, setPhonenumber] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedPhonenumber = sessionStorage.getItem("phonenumber");
        const response = await axios.get(`http://49.204.232.254:90/users/getall`);
        const userData = response.data.data.find(user => user.phonenumber === storedPhonenumber);

        if (userData) {
          setEmail(userData.email);
          setPhonenumber(userData.phonenumber);
          setUsername(userData.username || "");
          setProfilePicture(userData.image[0] ? `http://49.204.232.254:90/api/${userData.image[0]}` : ava);
          setFormData(prev => ({ ...prev, skills: userData.skills || [] }));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleImageUpload = async () => {
    const storedPhonenumber = sessionStorage.getItem("phonenumber");
    if (storedPhonenumber && formData.image.length > 0) {
      try {
        const formDataToUpload = new FormData();
        formDataToUpload.append("phoneNumber", storedPhonenumber);
        formData.image.forEach((imageFile) => {
          formDataToUpload.append("image", imageFile);
        });
        await axios.post(
          `http://49.204.232.254:90/users/imageupload/${storedPhonenumber}`,
          formDataToUpload,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        Swal.fire({
          icon: "success",
          title: "Image Uploaded Successfully",
          text: "Your image has been uploaded.",
        });

        setFormData(prevData => ({ ...prevData, image: [] }));
      } catch (error) {
        console.error("Error uploading image:", error);
        Swal.fire({
          icon: "error",
          title: "Upload Failed",
          text: "Failed to upload image.",
        });
      }
    }
  };
    
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (e.target.name === "image") {
      setFormData((prevData) => ({
        ...prevData,
        image: [...prevData.image, ...files],
      }));
    }
  };

    const handleShareSkillClick = () => {
    setShowShareSkillForm((prev) => !prev);
  };

  const handleUploadVideoClick = () => {
    setShowUploadVideoForm((prev) => !prev);
  };

  const handleShareSkillSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const skillnameInput = form.skillname.value;
    const experiencesInput = form.experiences.value;
    const qualificationsInput = form.qualifications.value;
    const languagesInput = form.languages.value.split(",").map(lang => lang.trim());
    const certificatesInput = form.certificates.files ? Array.from(form.certificates.files) : [];
    const storedPhonenumber = sessionStorage.getItem("phonenumber");

    const formDataToUpload = new FormData();
    formDataToUpload.append("skillname", skillnameInput);
    formDataToUpload.append("experiences", experiencesInput);
    formDataToUpload.append("qualifications", qualificationsInput);
    formDataToUpload.append("languages", JSON.stringify(languagesInput));
    certificatesInput.forEach(file => {
      formDataToUpload.append("certificates", file);
    });

    try {
      await axios.post(
        `http://49.204.232.254:90/users/updateskills/${storedPhonenumber}`,
        formDataToUpload,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

     
      const allUsersResponse = await axios.get(`http://49.204.232.254:90/users/getall`);
      const updatedUserData = allUsersResponse.data.data.find(user => user.phonenumber === storedPhonenumber);
      if (updatedUserData) {
        setFormData(prev => ({ ...prev, skills: updatedUserData.skills || [] }));
      }

      Swal.fire({
        icon: "success",
        title: "Skills Updated Successfully",
        text: "Your skills have been updated.",
      });

      form.reset();
      setShowShareSkillForm(false);
    } catch (error) {
      console.error("Error updating skills:", error.response ? error.response.data : error.message);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.response?.data?.message || "Failed to update your skills.",
      });
    }
  };
  const handleVideoChange = (e) => {
        setVideoFile(e.target.files[0]);
      };

      const handleVideoUpload = async (e) => {
        e.preventDefault(); 
        const form = e.target;
        const videoName = form.videoName.value;
        const description = form.description.value;
        const duration = form.duration.value;
        const storedPhonenumber = sessionStorage.getItem("phonenumber");
      
       
        const formDataToUpload = new FormData();
        formDataToUpload.append("uploadedBy", storedPhonenumber);
        formDataToUpload.append("videoName", videoName);
        formDataToUpload.append("description", description);
        formDataToUpload.append("duration", duration);
        formDataToUpload.append("video", videoFile);
      
        try {
          await axios.post(`http://localhost:8080/videos/upload`, formDataToUpload, {
            headers: { "Content-Type": "multipart/form-data" },
          });
      
          Swal.fire({
            icon: "success",
            title: "Video Uploaded Successfully",
            text: "Your video has been uploaded.",
          });
      
          setVideoFile(null); 
          setShowUploadVideoForm(false); 
        } catch (error) {
          console.error("Error uploading video:", error);
          Swal.fire({
            icon: "error",
            title: "Upload Failed",
            text: "Failed to upload video.",
          });
        }
      };
      
  return (
    <div className="profile-container">
      <nav className="sidebar">
        <ul>
          <li>
            <div className="logo">
              <img src={profilepic ? profilepic : ava} alt="Profile" />
            </div>
          </li>
          <li>
            <a href="/MainScreen" className="nav-link">
              <i className="fas fa-home"></i>
              <span className="nav-item">Home</span>
            </a>
          </li>
          <li>
            <a href="/" className="nav-link logout">
              <i className="fas fa-sign-out-alt"></i>
              <span className="nav-item">Log out</span>
            </a>
          </li>
        </ul>
      </nav>
      <section className="main">
        <h1 className="pro">Profile</h1>
        <div className="profile-content">
          <div className="profile-info">
            <div className="profile-data">
              <div className="form-label-2">Username:</div>
              <div className="form-input-2">{username}</div>
            </div>
            <div className="profile-data">
              <div className="form-label-2">Email:</div>
              <div className="form-input-2">{email}</div>
            </div>
            <div className="profile-data">
              <div className="form-label-2">Phone Number:</div>
              <div className="form-input-2">{phonenumber}</div>
            </div>
            <div className="form-group">
              <label>Upload Image:</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
                className="form-input"
                multiple
              />
            </div>
            <div className="form-actions">
              <button type="button" onClick={handleImageUpload} className="submit-button-2">
                Upload Image
              </button>
            </div>
          </div>

          <button type="button" onClick={handleShareSkillClick} className="share-skill-button">
            Share Skills
          </button>

          {showShareSkillForm && (
            <div className="share-skill-form">
              <h2>Share Your Skills</h2>
              <form onSubmit={handleShareSkillSubmit}>
                <div className="form-group">
                  <label>Skill Name:</label>
                  <input type="text" name="skillname" required />
                </div>
                <div className="form-group">
                  <label>Experiences:</label>
                  <input type="text" name="experiences" required />
                </div>
                <div className="form-group">
                  <label>Qualifications:</label>
                  <input type="text" name="qualifications" required />
                </div>
                <div className="form-group">
                  <label>Languages:</label>
                  <input type="text" name="languages" placeholder="Comma-separated" required />
                </div>
                <div className="form-group">
                  <label>Certificates:</label>
                  <input type="file" name="certificates" accept=".pdf,.doc,.docx" multiple />
                </div>
                <div className="form-actions">
                  <button type="submit" className="submit-button-2">Submit</button>
                </div>
              </form>
            </div>
          )}

          <button type="button" onClick={handleUploadVideoClick} className="submit-button-2">
            Upload Video
          </button>

          {showUploadVideoForm && (
  <div className="submit-button-12">
    <h2>Upload Video</h2>
    <form onSubmit={handleVideoUpload}>
      <div className="form-group">
        <label>Video Name:</label>
        <input type="text" name="videoName" required />
      </div>
      <div className="form-group">
        <label>Description:</label>
        <input type="text" name="description" required />
      </div>
      <div className="form-group">
        <label>Duration (in seconds):</label>
        <input type="number" name="duration" required />
      </div>
      <div className="form-group">
        <label>Select Video:</label>
        <input type="file" onChange={handleVideoChange} accept="video/*" required />
      </div>
      <div className="form-actions">
        <button type="submit" className="submit-button112">
          Upload Video
        </button>
      </div>
    </form>
  </div>
)}


          <h2>Your Skills</h2>
          {formData.skills.length > 0 ? (
            <ul>
              {formData.skills.map((skill, index) => (
                <li key={index}>
                  <div className="skill-name">{skill.skillname}</div>
                  <div className="skill-status">
                    Status: {skill.status || "Not Approved"}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No skills added yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default ProfilePage;