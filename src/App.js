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

Axios.defaults.baseURL = "http://localhost:8080";

function App() {
  const [LoggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem("userToken")));

  return (
    <BrowserRouter>
      <div className="App">
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
            {LoggedIn ? <CreatePost /> : <HomeGuest/>}
          </Route>
          <Route path="/posts/:id">
            <ViewSinglePost/>
          </Route>
        </Switch>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
