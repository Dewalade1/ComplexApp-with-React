import React, { useContext } from "react";
import { Link } from "react-router-dom";

import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";

function UserLoggedIn(props) {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  function handleLogout(e) {
    e.preventDefault();
    try {
      appDispatch({ type: "logout" });
    } catch (e) {
      console.log("[Error] Cannot log user out");
    }
  }

  return (
    <div className="flex-row my-3 my-md-0">
      <Link to="#" className="text-white mr-2 header-search-icon">
        <i className="fas fa-search"></i>
      </Link>
      <span className="mr-2 header-chat-icon text-white">
        <i className="fas fa-comment"></i>
        <span className="chat-count-badge text-white"> </span>
      </span>
      <Link to={`/profile/${appState.user.username}`} className="mr-2">
        <img className="small-header-avatar" src={appState.user.avatar} alt="User Avatar" />
      </Link>
      <Link className="btn btn-sm btn-success mr-2" to="/create-post">
        Create Post
      </Link>
      <button onClick={handleLogout} className="btn btn-sm btn-secondary btn-danger">
        Sign Out
      </button>
    </div>
  );
}

export default UserLoggedIn;
