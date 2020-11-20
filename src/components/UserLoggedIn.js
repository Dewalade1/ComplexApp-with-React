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
      <ReactTooltip place="bottom" id="search" className="custom-tooltip" />
      {"  "}
      <span data-tip="Chat" onClick={() => appDispatch({ type: "toggleChat" })} data-for="chat" className={"mr-2 header-chat-icon " + (appState.unreadMessageCount > 0 ? "text-warning" : "text-white")}>
        <i className="fas fa-comment"></i>
        {appState.unreadMessageCount > 0 ? <span className="chat-count-badge text-white"> {appState.unreadMessageCount < 10 ? appState.unreadMessageCount : '9+'} </span> : ""}
      </span>
      <ReactTooltip place="bottom" id="chat" className="custom-tooltip" />
      {"  "}
      <Link data-for="profile" data-tip={appState.user.username} to={`/profile/${appState.user.username}`} className="mr-2">
        <img className="small-header-avatar" src={appState.user.avatar} alt="User Avatar" />
      </Link>
      <ReactTooltip place="bottom" id="profile" className="custom-tooltip" />
      {"  "}
      <Link className="btn btn-sm btn-success mr-2" to="/create-post">
        Create Post
      </Link>
      {"  "}
      <button onClick={handleLogout} className="btn btn-sm btn-danger">
        Sign Out
      </button>
    </div>
  );
}

export default UserLoggedIn;
