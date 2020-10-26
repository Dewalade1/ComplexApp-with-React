import Axios from "axios";
import { useImmerReducer } from "use-immer";
import React, { useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";

import "./App.css";
import About from "./components/About";
import CreatePost from "./components/CreatePost";
import Footer from "./components/Footer";
import Header from "./components/Header";
import HomeLoggedIn from "./components/HomeLoggedIn";
import HomeGuest from "./components/HomeGuest";
import Terms from "./components/Terms";
import ViewSinglePost from "./components/ViewSinglePost";
import FlashMessages from "./components/FlashMessages";

Axios.defaults.baseURL = "http://localhost:8080";

function App() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("userToken")),
    flashMessages: [],
    user: {
      token: localStorage.getItem("userToken"),
      username: localStorage.getItem("userName"),
      avatar: localStorage.getItem("userAvatar")
    }
  };

  function ourReducer(draft, action) {
    switch (action.type) {
      case "login":
        draft.loggedIn = true;
        draft.user = action.userData;
        break;
      case "logout":
        draft.loggedIn = false;
        break;
      case "flashMessage":
        draft.flashMessages.push(action.value);
        break;
      default:
        return draft;
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("userToken", state.user.token);
      localStorage.setItem("userName", state.user.username);
      localStorage.setItem("userAvatar", state.user.avatar);
    } else {
      localStorage.removeItem("userToken");
      localStorage.removeItem("userName");
      localStorage.removeItem("userAvatar");
    }
  }, state.loggedIn);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <div className="App">
            <FlashMessages messages={state.flashMessages} />
            <Header />
            <Switch>
              <Route path="/" exact>
                {state.loggedIn ? <HomeLoggedIn /> : <HomeGuest />}
              </Route>
              <Route path="/about-us" exact>
                <About />
              </Route>
              <Route path="/terms">
                <Terms />
              </Route>
              <Route path="/create-post" exact>
                {state.loggedIn ? <CreatePost /> : <HomeGuest />}
              </Route>
              <Route path="/posts/:id">{state.loggedIn ? <ViewSinglePost /> : <HomeGuest />}</Route>
            </Switch>
            <Footer />
          </div>
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export default App;
