import Axios from "axios";
import React, { useContext, useEffect } from "react";
import { NavLink, useParams, Switch, Route } from "react-router-dom";
import { useImmer } from "use-immer";

import Page from "./Page";
import StateContext from "../StateContext";
import ProfilePosts from "./ProfilePosts";
import ProfileFollowLists from "./ProfileFollowLists";
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
        appDispatch({ type: "flashMessage", value: ["alert-danger", "Could not fetch post"] });
      }
    }
    fetchData();

    return () => {
      ourCancelToken.cancel();
    };
  }, [username]);

  useEffect(() => {
    if (state.startFollowingRequestCount) {
      setState(draft => {
        draft.followActionLoading = true;
      });

      const request = Axios.CancelToken.source();
      async function startFollowing() {
        try {
          const response = await Axios.post(`/addFollow/${state.profileData.profileUsername}`, { token: appState.user.token, cancelToken: request.token });
          setState(draft => {
            draft.profileData.isfollowing = true;
            draft.profileData.counts.followerCount++;
            draft.followActionLoading = false;
          });
          appDispatch({ type: "flashMessage", value: ["alert-success", `You now follow ${state.profileData.profileUsername}`] });
        } catch (e) {
          draft.followActionLoading = false;
          appDispatch({ type: "flashMessage", value: ["alert-danger", `could not follow ${state.profileData.profileUsername}`] });
        }
      }
      startFollowing();
      return () => request.cancel();
    }
  }, [state.startFollowingRequestCount]);

  useEffect(() => {
    if (state.stopFollowingRequestCount) {
      setState(draft => {
        draft.unfollowActionLoading = true;
      });

      const request = Axios.CancelToken.source();
      async function stopFollowing() {
        try {
          const response = await Axios.post(`/removeFollow/${state.profileData.profileUsername}`, { token: appState.user.token, cancelToken: request.token });
          setState(draft => {
            draft.profileData.isfollowing = false;
            draft.profileData.counts.followerCount--;
            draft.unfollowActionLoading = false;
          });
          appDispatch({ type: "flashMessage", value: ["alert-success", `You no longer follow ${state.profileData.profileUsername}`] });
        } catch (e) {
          draft.unfollowActionLoading = false;
          appDispatch({ type: "flashMessage", value: ["alert-danger", `Could not unfollow ${state.profileData.profileUsername}`] });
        }
      }
      stopFollowing();
      return () => request.cancel();
    }
  }, [state.stopFollowingRequestCount]);

  function followHandler() {
    setState(draft => {
      draft.startFollowingRequestCount++;
    });
  }

  function unfollowHandler() {
    setState(draft => {
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

      <div className="profile-nav nav nav-pills nav-fill pt-2 mb-4">
        <NavLink exact to={`/profile/${state.profileData.profileUsername}`} className="nav-item nav-link">
          {state.profileData.counts.postCount} Posts
        </NavLink>
        <NavLink to={`/profile/${state.profileData.profileUsername}/followers`} className="nav-item nav-link">
          {state.profileData.counts.followerCount} Followers
        </NavLink>
        <NavLink to={`/profile/${state.profileData.profileUsername}/following`} className="nav-item nav-link">
          {state.profileData.counts.followingCount} Following
        </NavLink>
      </div>

      <Switch>
        <Route path="/profile/:username" exact>
          <ProfilePosts />
        </Route>
        <Route path="/profile/:username/followers">
          <ProfileFollowLists type="followers"/>
        </Route>
        <Route path="/profile/:username/following">
          <ProfileFollowLists type="following"/>
        </Route>
      </Switch>
    </Page>
  );
}

export default Profile;
