import React from "react";
import { Link } from "react-router-dom";
import HeaderLoginForm from "./HeaderLoginForm";
import UserLoggedIn from "./UserLoggedIn";

function Header(props) {
  return (
    <header className="header-bar bg-primary mb-3">
      <div className="container d-flex flex-column flex-md-row align-items-center p-3">
        <h4 className="my-0 mr-md-auto font-weight-normal">
          <Link to="/" className="text-white">
            ComplexApp<i className="fas fa-pen-alt"></i>
          </Link>
        </h4>
        {props.LoggedIn ? <UserLoggedIn setLoggedIn={props.setLoggedIn} /> : <HeaderLoginForm setLoggedIn={props.setLoggedIn} />}
      </div>
    </header>
  );
}

export default Header;
