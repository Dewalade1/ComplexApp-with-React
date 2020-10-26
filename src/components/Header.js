import React, { useContext } from "react";
import { Link } from "react-router-dom";

import HeaderLoginForm from "./HeaderLoginForm";
import UserLoggedIn from "./UserLoggedIn";
import StateContext from "../StateContext";

function Header(props) {
  const appState = useContext(StateContext);

  return (
    <header className="header-bar bg-primary mb-3">
      <div className="container d-flex flex-column flex-md-row align-items-center p-3">
        <h4 className="my-0 mr-md-auto font-weight-normal">
          <Link to="/" className="text-white">
            ComplexApp<i className="fas fa-pen-alt"></i>
          </Link>
        </h4>
        {appState.loggedIn ? <UserLoggedIn /> : <HeaderLoginForm />}
      </div>
    </header>
  );
}

export default Header;
