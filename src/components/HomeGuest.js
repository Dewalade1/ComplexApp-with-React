import Axios from "axios";
import React, { useContext, useEffect } from "react";
import { useImmerReducer } from "use-immer";
import { CSSTransition } from "react-transition-group";

import Page from "./Page";
import DispatchContext from "../DispatchContext";

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
    isRegistering: false,
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
        if (draft.username.value.length < 3) {
          draft.username.hasErrors = true;
          draft.username.errorMessage = "Username must be at least 3 characters long";
        }

        if (!draft.hasErrors && !action.noRequest) {
          draft.username.checkCount++;
        }
        break;
      case "usernameUniqueResults":
        if (action.value) {
          draft.username.hasErrors = true;
          draft.username.isUnique = false;
          draft.username.errorMessage = "This username is already taken";
        } else {
          draft.username.isUnique = true;
        }
        break;
      case "emailImmediately":
        draft.email.hasErrors = false;
        draft.email.value = action.value;
        break;
      case "emailAfterDelay":
        if (!/^\S+@\S+$/.test(draft.email.value)) {
          draft.email.hasErrors = true;
          draft.email.errorMessage = "Your email is not valid";
        }

        if (!draft.email.hasErrors && !action.noRequest) {
          draft.email.checkCount++;
        }
        break;
      case "emailUniqueResults":
        if (action.value) {
          draft.email.hasErrors = true;
          draft.email.isUnique = false;
          draft.email.errorMessage = "This email is already being used";
        } else {
          draft.email.isUnique = true;
        }
        break;
      case "passwordImmediately":
        draft.password.hasErrors = false;
        draft.password.value = action.value;
        if (draft.password.value.length > 50) {
          draft.password.hasErrors = true;
          draft.password.errorMessage = "Password cannot exceed 50 characters.";
        }
        break;
      case "passwordAfterDelay":
        if (draft.password.value.length < 12) {
          draft.password.hasErrors = true;
          draft.password.errorMessage = "Password must have more than 11 characters.";
        }
        break;
      case "registrationStarted":
        draft.registrationButton = "Registering new user...";
        draft.isRegistering = true;
        break;
      case "loginrequeststarted":
        draft.registrationButton = "Logging in...";
        break;
      case "loginrequestfinished":
        draft.isRegistering = false;
        draft.registrationButton = "Welcome...";
        break;
      case "submitForm":
        if (!draft.username.hasErrors && draft.username.isUnique && !draft.email.hasErrors && draft.email.isUnique && !draft.password.hasErrors) {
          draft.submitCount++;
        }
        break;
      default:
        return draft;
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  useEffect(() => {
    if (state.username.value) {
      const delay = setTimeout(() => dispatch({ type: "usernameAfterDelay" }), 800);
      return () => clearTimeout(delay);
    }
  }, [state.username.value]);

  useEffect(() => {
    if (state.email.value) {
      const delay = setTimeout(() => dispatch({ type: "emailAfterDelay" }), 800);
      return () => clearTimeout(delay);
    }
  }, [state.email.value]);

  useEffect(() => {
    if (state.password.value) {
      const delay = setTimeout(() => dispatch({ type: "passwordAfterDelay" }), 800);
      return () => clearTimeout(delay);
    }
  }, [state.password.value]);

  useEffect(() => {
    if (state.username.checkCount) {
      const request = Axios.CancelToken.source();
      async function usernameIsUnique() {
        try {
          const response = await Axios.post("/doesUsernameExist", { username: state.username.value }, { cancelToken: request.token });
          dispatch({ type: "usernameUniqueResults", value: response.data });
        } catch (e) {
          appDispatch({ type: "flashMessage", value: ["alert-danger", "Could not verify that this username is Unique"] });
        }
      }
      usernameIsUnique();
      return () => request.cancel();
    }
  }, [state.username.checkCount]);

  useEffect(() => {
    if (state.email.checkCount) {
      const request = Axios.CancelToken.source();
      async function emailIsUnique() {
        try {
          const response = await Axios.post("/doesEmailExist", { email: state.email.value }, { cancelToken: request.token });
          dispatch({ type: "emailUniqueResults", value: response.data });
        } catch (e) {
          appDispatch({ type: "flashMessage", value: ["alert-danger", "Could not verify that your email is Unique"] });
        }
      }
      emailIsUnique();
      return () => request.cancel();
    }
  }, [state.email.checkCount]);

  useEffect(() => {
    if (state.submitCount) {
      const request = Axios.CancelToken.source();
      async function submitRequest() {
        try {
          dispatch({ type: "registrationStarted" });
          const response = await Axios.post("/register", { username: state.username.value, email: state.email.value, password: state.password.value }, { cancelToken: request.token });
          dispatch({ type: "loginrequeststarted" });
          appDispatch({ type: "login", userData: response.data });
          dispatch({ type: "loginrequestfinished" });
          appDispatch({ type: "flashMessage", value: ["alert-success", "Congrats! Welcome to your new account"] });
        } catch (e) {
          appDispatch({ type: "flashMessage", value: ["alert-danger", "Could not complete user registeration"] });
        }
      }
      submitRequest();
      return () => request.cancel();
    }
  }, [state.submitCount]);

  function handleSubmit(e) {
    e.preventDefault();
    dispatch({ type: "usernameImmediately", value: state.username.value });
    dispatch({ type: "usernameAfterDelay", value: state.username.value, noRequest: true });
    dispatch({ type: "emailImmediately", value: state.email.value });
    dispatch({ type: "emailAfterDelay", value: state.email.value, noRequest: true });
    dispatch({ type: "passwordImmediately", value: state.password.value });
    dispatch({ type: "passwordAfterDelay", value: state.password.value });
    dispatch({ type: "submitForm" });
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
              <CSSTransition classNames="liveValidateMessage" in={state.email.hasErrors} timeout={330} unmountOnExit>
                <div className="alert alert-danger small liveValidateMessage">{state.email.errorMessage}</div>
              </CSSTransition>
            </div>
            <div className="form-group">
              <label htmlFor="password-register" className="text-muted mb-1">
                <small>Password</small>
              </label>
              <input onChange={(e) => dispatch({ type: "passwordImmediately", value: e.target.value })} id="password-register" name="password" className="form-control" type="password" placeholder="Create a password" autoComplete="off" />
              <CSSTransition in={state.password.hasErrors} unmountOnExit timeout={330} classNames="liveValidateMessage">
                <div className="alert alert-danger small liveValidateMessage">{state.password.errorMessage}</div>
              </CSSTransition>
            </div>
            <button disabled={state.isRegistering} type="submit" className="py-3 mt-4 btn btn-lg btn-success btn-block">
              {state.registrationButton}
            </button>
          </form>
        </div>
      </div>
    </Page>
  );
}

export default HomeGuest;
