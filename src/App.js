import Axios from "axios";
import { useImmerReducer } from "use-immer";
import React, { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { CSSTransition } from "react-transition-group";

import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";
import FlashMessages from "./components/FlashMessages";
import Footer from "./components/Footer";
import Header from "./components/Header";
import HomeGuest from "./components/HomeGuest";
import LoadingIcon from "./components/LoadingIcon";

// Lazy loading components with React (speeds up loading)
const About = lazy(() => import("./components/About"));
// Lazyload live chat component
const CreatePost = lazy(() => import("./components/CreatePost"));
const EditPost = lazy(() => import("./components/EditPost"));
const HomeLoggedIn = lazy(() => import("./components/HomeLoggedIn"));
const PageNotFound = lazy(() => import("./components/PageNotFound"));
const Profile = lazy(() => import("./components/Profile"));
const Terms = lazy(() => import("./components/Terms"));
const ViewSinglePost = lazy(() => import("./components/ViewSinglePost"));
const Search = lazy(() => import("./components/Search"));

Axios.defaults.baseURL = "https://backend-for-complexapp.herokuapp.com" || process.env.BACKENDURL;

function App() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("userToken")),
    flashMessages: { class: "", content: [] },
    flashMessageClass: "alert-success",
    user: {
      token: localStorage.getItem("userToken"),
      username: localStorage.getItem("userName"),
      avatar: localStorage.getItem("userAvatar"),
    },
    isSearchOpen: false,
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
        draft.flashMessages.class = action.value[0];
        draft.flashMessages.content.push(action.value[1]);
        break;
      case "openSearch":
        draft.isSearchOpen = true;
        break;
      case "closeSearch":
        draft.isSearchOpen = false;
        break;
      default:
        break;
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
  }, [state.loggedIn]);

  // Check if user token has expired or not on first render
  useEffect(() => {
    if (state.loggedIn) {
      const request = Axios.CancelToken.source();
      async function checkTokenValidity() {
        try {
          const response = await Axios.post("/checkToken", { token: state.user.token }, { cancelToken: request.token });
          if (!response.data) {
            dispatch({ type: "logout" });
            dispatch({ type: "flashMessage", value: ["alert-info", "Your session has expired. Kindly log in again."] });
          }
        } catch (e) {
          dispatch({ type: "flashMessage", value: ["alert-danger", "Cannot login. Unable to verify user token."] });
        }
      }
      checkTokenValidity();
      return () => request.cancel();
    }
  }, []);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <div className="App">
            <FlashMessages messages={state.flashMessages} />
            <Header />
            <Suspense fallback={<LoadingIcon />}>
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
                <Route path="/posts/:id/edit" exact>
                  {state.loggedIn ? <EditPost /> : <HomeGuest />}
                </Route>
                <Route path="/profile/:username">{state.loggedIn ? <Profile /> : <HomeGuest />}</Route>
                <Route path="/posts/:id" exact>
                  {state.loggedIn ? <ViewSinglePost /> : <HomeGuest />}
                </Route>
                <Route>
                  <PageNotFound />
                </Route>
              </Switch>
            </Suspense>
            <CSSTransition in={state.isSearchOpen} timeout={330} unmountOnExit classNames="search-overlay">
              <div className="search-overlay">
                <Suspense fallback="">
                  <Search />
                </Suspense>
              </div>
            </CSSTransition>
            <Footer />
          </div>
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export default App;
