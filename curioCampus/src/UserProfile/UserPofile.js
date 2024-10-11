import React, { useState } from "react";
import "./UserProfile.css";
import im from '../UserProfile/pro.jpg';
import { MdVideoCall, MdOutlineVideoSettings } from "react-icons/md";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { FaStar } from "react-icons/fa";

function UserProfile() {
 

  return (
    <div className="full-content-up">
      <div className="full-body-up">
        {/* Left Side (Profile) */}
        <div className="profile-side-up">
          <img src={im} className="profile-pic-up" alt="profile" />
          <h2 className="profile-name-up">Pranesh</h2>
          <h4 className="profile-role-up">Web Developer</h4>
          <div className="social-icons-up">
            <IoChatbubbleEllipsesOutline className="chat-up" />
            <MdVideoCall className="video-up" />
            <MdOutlineVideoSettings className="record-up" />
          </div>
        </div>

        {/* Right Side (Information) */}
        <div className="right-side-up">
          
          {/* Experience and Languages Section */}
          <h3 className="info-row-up">Experience</h3>
          <p className="info-value-up">3 years.</p>

          <h3 className="info-row-up">Languages</h3>
          <p className="info-value-up">Tamil, English.</p>
          
          <h3 className="info-row-up">Qualifications</h3>
          <p className="info-value-up">DevopsEngineer,Masters.</p>
          
       
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
