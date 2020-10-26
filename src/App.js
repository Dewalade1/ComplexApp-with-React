import Axios from "axios";
import React, { useReducer } from "react";
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
  };

  function ourReducer(state, action) {
    switch (action.type) {
      case "login":
        return { loggedIn: true, flashMessages: state.flashMessages };
      case "logout":
        return { loggedIn: false, flashMessages: state.flashMessages };
      case "flashMessage":
        return { loggedIn: state.loggedIn, flashMessages: state.flashMessages.concat(action.value) };
      default:
        return { loggedIn: state.loggedIn, flashMessages: state.flashMessages };
    }
  }

  const [state, dispatch] = useReducer(ourReducer, initialState);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <div className="App">
            <FlashMessages messages={state.flashMessage} />
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
