import Axios from "axios";
import React, { useContext, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {useImmer} from "use-immer";

import Page from "./Page";
import StateContext from "../StateContext";
import ProfilePosts from "./ProfilePosts";
import DispatchContext from "../DispatchContext";

function Profile() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const { username } = useParams();
  const [state, setState] = useImmer({
    followActionLoading: false,
    unfollowActionLoading: false,
    startFollowingRequestCount: 0,
    stopFollowingRequestCount: 0,
    profileData: { profileUsername: "...", profileAvatar: appState.user.avatar, isfollowing: false, counts: { postCount: "", followingCount: "", followerCount: "" } },
  });

  useEffect(() => {
    const ourCancelToken = Axios.CancelToken.source();

    async function fetchData() {
      try {
        const response = await Axios.post(`/profile/${username}`, { token: appState.user.token, CancelToken: ourCancelToken.token });
        setState(draft => {
          draft.profileData = response.data;
        });
      } catch (e) {
        console.log("[Error] Could not fetch data or user left the page before load was completed");
      }
    }
    fetchData();

    return ( () => {
      ourCancelToken.cancel();
    })
  }, [username]);

  useEffect(() => {
    if (state.startFollowingRequestCount) {
      setState( draft => {
        draft.followActionLoading = true;
      });

      const request = Axios.CancelToken.source();
      async function startFollowing() {
        try{
          const response = await Axios.post(`/addFollow/${state.profileData.profileUsername}`, { cancelToken: request.token });
          setState( draft => {
            draft.profileData.isfollowing = true;
            draft.profileData.counts.followerCount++;
            draft.followActionLoading = false;
          });
          appDispatch({type: "flashMessage", value: ["alert-success", `You now follow ${state.profileData.profileUsername}`]});
        } catch (e) {
          draft.followActionLoading = false;
          appDispatch({ type: "flashMessage", value: ["alert-danger", `could not follow ${state.profileData.profileUsername}`] });
        }
      }
      startFollowing();
      return () => request.cancel();
    }
  }, [state.startFollowingRequestCount]);

  useEffect( () => {
    if (state.stopFollowingRequestCount) {
      const request = Axios.CancelToken.source();
      async function stopFollowing() {
        try {
          const response = await Axios.post(`/removeFollow/${state.profileData.profileUsername}`, {cancelToken: request.token});
          setState( draft => {
            draft.profileData = response.data;
            draft.profileData.isfollowing = false;
            draft.profileData.counts.followerCount--;
            draft.unfollowActionLoading = false;
          });
          appDispatch({type:"flashMessage", value: ["alert-success", `You no longer follow ${state.profileData.profileUsername}`]});
        } catch (e) {
          draft.unfollowActionLoading = false;
          appDispatch({type: "flashMessage", value: ["alert-danger", `Could not unfollow ${state.profileData.profileUsername}`]});
        }
      }
      stopFollowing();
      return () => request.cancel();
    }
  }, [state.stopFollowingRequestCount]);

  function followHandler () {
    setState( draft => {
      draft.startFollowingRequestCount++;
    });
  }

  function unfollowHandler () {
    setState( draft => {
      draft.stopFollowingRequestCount++;
    });
  }

  return (
    <Page title="Your Profile">
      <h2>
        <img className="avatar-small" src={state.profileData.profileAvatar} alt="Your Avatar" /> {state.profileData.profileUsername}
        {appState.loggedIn && !state.profileData.isfollowing && appState.user.username != state.profileData.profileUsername && state.profileData.profileUsername != "..." && (
          <button onClick={followHandler} disabled={state.followActionLoading} className="btn btn-outline-primary btn-sm ml-2">
            Follow <i className="fas fa-user-plus"></i>
          </button>
        )}
        {appState.loggedIn && state.profileData.isfollowing && appState.user.username != state.profileData.profileUsername && state.profileData.profileUsername != "..." && (
          <button onClick={unfollowHandler} disabled={state.unfollowActionLoading} className="btn btn-outline-dark btn-sm ml-2">
            Unfollow <i className="fas fa-user-times"></i>
          </button>
        )}
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <Link to="#" className="active nav-item nav-link">
          Posts: {state.profileData.counts.postCount}
        </Link>
        <Link to="#" className="nav-item nav-link">
          Followers: {state.profileData.counts.followerCount}
        </Link>
        <Link to="#" className="nav-item nav-link">
          Following: {state.profileData.counts.followingCount}
        </Link>
      </div>

      <ProfilePosts />
    </Page>
  );
}

export default Profile;
