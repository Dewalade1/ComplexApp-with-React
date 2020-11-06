import Axios from "axios";
import React, { useState, useContext } from "react";
import { useImmerReducer } from "use-immer";
import { CSSTransition } from "react-transition-group";

import Page from "./Page";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";

function HomeGuest() {
  const appDispatch = useContext(DispatchContext);
  const initialState = {
    username: {
      value: "",
      hasErrors: false,
      errorMessage: "",
      isUnique: false,
      checkCount: 0,
    },

    email: {
      value: "",
      hasErrors: false,
      errorMessage: "",
      isUnique: false,
      checkCount: 0,
    },

    password: {
      value: "",
      hasErrors: false,
      errorMessage: "",
    },
    isLoggingIn: false,
    registrationButton: "Sign up for ComplexApp",
    submitCount: 0,
  };

  function ourReducer(draft, action) {
    switch (action.type) {
      case "usernameImmediately":
        draft.username.hasErrors = false;
        draft.username.value = action.value;
        if (draft.username.value.length > 30) {
          draft.username.hasErrors = true;
          draft.username.errorMessage = "Username must be less than 30 characters long.";
        }

        if (draft.username.value && !/^([a-zA-Z0-9]+)$/.test(draft.username.value)) {
          draft.username.hasErrors = true;
          draft.username.errorMessage = "Username can only contain letters and numbers.";
        }
        break;
      case "usernameAfterDelay":
        break;
      case "usernameUniqueResults":
        break;
      case "emailImmediately":
        draft.email.hasErrors = false;
        draft.email.value = action.value;
        break;
      case "emailAfterDelay":
        break;
      case "emailUniqueResults":
        break;
      case "passwordImmediately":
        break;
      case "passwordAfterDelay":
        break;
      case "registrationStarted":
        draft.registrationButton = "Registering new user...";
      case "loginrequeststarted":
        draft.isLoggingIn = true;
        draft.registrationButton = "Logging in...";
      case "loginrequestfinished":
        draft.isLoggingIn = false;
        draft.registrationButton = "Welcome...";
        break;
      case "submitForm":
        break;
      default:
        return draft;
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <Page title="Home" wide={true}>
      <div className="row align-items-center">
        <div className="col-lg-7 py-3 py-md-5">
          <div className="text-center">
            {" "}
            <i className="icon fas fa-mail-bulk fa-9x"></i>
          </div>
          <h1 className="display-3">
            <b>Remember Writing?</b>
          </h1>
          <p className="lead text-muted">Are you sick of short tweets and impersonal &ldquo;shared&rdquo; posts that are reminiscent of the late 90&rsquo;s email forwards? We believe getting back to actually writing is the key to enjoying the internet again.</p>
        </div>
        <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username-register" className="text-muted mb-1">
                <small>Username</small>
              </label>
              <input onChange={(e) => dispatch({ type: "usernameImmediately", value: e.target.value })} id="username-register" name="username" className="form-control" type="text" placeholder="Pick a username" autoComplete="off" />
              <CSSTransition in={state.username.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                <div className="alert alert-danger small liveValidateMessage">{state.username.errorMessage}</div>
              </CSSTransition>
            </div>
            <div className="form-group">
              <label htmlFor="email-register" className="text-muted mb-1">
                <small>Email</small>
              </label>
              <input onChange={(e) => dispatch({ type: "emailImmediately", value: e.target.value })} id="email-register" name="email" className="form-control" type="text" placeholder="you@example.com" autoComplete="off" />
            </div>
            <div className="form-group">
              <label htmlFor="password-register" className="text-muted mb-1">
                <small>Password</small>
              </label>
              <input onChange={(e) => dispatch({ type: "passwordImmediately", value: e.target.value })} id="password-register" name="password" className="form-control" type="password" placeholder="Create a password" autoComplete="off" />
            </div>
            <button type="submit" className="py-3 mt-4 btn btn-lg btn-success btn-block">
              {state.registrationButton}
            </button>
          </form>
        </div>
      </div>
    </Page>
  );
}

export default HomeGuest;
