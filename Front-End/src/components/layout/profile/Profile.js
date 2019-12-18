import React from "react";
import { Link } from "react-router-dom";
import { Avatar } from "antd";

import "./Profile.scss";
import Grid from "antd/lib/card/Grid";

function Profile(props) {
  const { email, name, username, picture, description } = props.data;
  return (
    <div className="profile-container">
      <div className="profile container center">
        <div className="profile-img-section">
          {picture ? (
            <img alt="profile" className="user-profile-img" src={picture} />
          ) : (
            <Avatar
              style={{
                color: "#f56a00",
                backgroundColor: "#fde3cf"
              }}
            >
              {name.split(" ")[0]}
            </Avatar>
          )}
        </div>
        <div className="profile-details">
          <div className="profile-main">
            <h3 className="user-name">{username}</h3>
            <Link className="user-edit-link" to="/profile/edit">
              Edit Profile
            </Link>
          </div>
          <div className="description-container">
            <p className="user-description">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
