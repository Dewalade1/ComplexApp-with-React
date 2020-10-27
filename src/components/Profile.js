import Axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Page from "./Page";
import StateContext from "../StateContext";
import ProfilePosts from "./ProfilePosts";

function Profile() {
  const appState = useContext(StateContext);
  const { username } = useParams();
  const [profileData, setProfileData] = useState({
    profileUsername: "...",
    profileAvatar: appState.user.avatar,
    isfollowing: false,
    counts: { postCount: "", followingCount: "", followerCount: "" },
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await Axios.post(`/profile/${username}`, { token: appState.user.token });
        setProfileData(response.data);
      } catch (e) {
        console.log("[Error] Could not fetch data");
      }
    }
    fetchData();
  }, []);

  return (
    <Page title="Your Profile">
      <h2>
        <img className="avatar-small" src={profileData.profileAvatar} alt="Your Avatar" /> {profileData.profileUsername}
        <button className="btn btn-outline-primary btn-sm ml-2">
          Follow <i className="fas fa-user-plus"></i>
        </button>
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <Link to="#" className="active nav-item nav-link">
          Posts: {profileData.counts.postCount}
        </Link>
        <Link to="#" className="nav-item nav-link">
          Followers: {profileData.counts.followerCount}
        </Link>
        <Link to="#" className="nav-item nav-link">
          Following: {profileData.counts.followingCount}
        </Link>
      </div>

      <ProfilePosts />
    </Page>
  );
}

export default Profile;
