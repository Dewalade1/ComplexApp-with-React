import Axios from "axios";
import React, { useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

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
  const [LoggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem("userToken")));
  const [flashMessage, setFlashMessages] = useState([]);

  function addFlashMessage(msg) {
    setFlashMessages((prev) => prev.concat(msg));
  }

  return (
    <BrowserRouter>
      <div className="App">
        <FlashMessages messages={flashMessage} />
        <Header LoggedIn={LoggedIn} setLoggedIn={setLoggedIn} />
        <Switch>
          <Route path="/" exact>
            {LoggedIn ? <HomeLoggedIn /> : <HomeGuest />}
          </Route>
          <Route path="/about-us" exact>
            <About />
          </Route>
          <Route path="/terms">
            <Terms />
          </Route>
          <Route path="/create-post" exact>
            {LoggedIn ? <CreatePost addFlashMessage={addFlashMessage} /> : <HomeGuest />}
          </Route>
          <Route path="/posts/:id">{LoggedIn ? <ViewSinglePost /> : <HomeGuest />}</Route>
        </Switch>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
