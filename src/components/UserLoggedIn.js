import React, { useContext } from "react";
import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";

import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";

function UserLoggedIn(props) {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  function handleLogout(e) {
    e.preventDefault();
    try {
      appDispatch({ type: "logout" });
      appDispatch({ type: "flashMessage", value: ["alert-success", "You have logged out!"] });
    } catch (e) {
      appDispatch({ type: "flashMessage", value: ["alert-danger", "Cannot log out"] });
    }
  }

  function SearchIconHandler(e) {
    e.preventDefault();
    appDispatch({ type: "openSearch" });
  }

  return (
    <div className="flex-row my-3 my-md-0">
      <Link onClick={SearchIconHandler} data-tip="search" data-for="search" to="#" className="text-white mr-2 header-search-icon">
        <i className="fas fa-search"></i>
      </Link>
      <ReactTooltip id="search" className="custom-tooltip" />
      {"  "}
      <span data-tip="Comment" data-for="comment" className="mr-2 header-chat-icon text-white">
        <i className="fas fa-comment"></i>
        <span className="chat-count-badge text-white"> </span>
      </span>
      <ReactTooltip id="comment" className="custom-tooltip" />
      {"  "}
      <Link to={`/profile/${appState.user.username}`} className="mr-2">
        <img className="small-header-avatar" src={appState.user.avatar} alt="User Avatar" />
      </Link>
      <Link className="btn btn-sm btn-success mr-2" to="/create-post">
        Create Post
      </Link>
      <button onClick={handleLogout} className="btn btn-sm btn-danger">
        Sign Out
      </button>
    </div>
  );
}

export default UserLoggedIn;
