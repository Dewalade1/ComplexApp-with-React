import Axios from "axios";
import React, { useContext, useEffect } from "react";
import { useImmer } from "use-immer";

import Post from "./Post";
import DispatchContext from "../DispatchContext";
import NetworkError from "./NetworkError";

function Search() {
  const appDispatch = useContext(DispatchContext);
  const [state, setState] = useImmer({
    searchTerm: "",
    results: [],
    show: "neither",
    requestCount: 0,
  });

  useEffect(() => {
    document.addEventListener("keyup", searchKeyPressHandler);
    return () => document.removeEventListener("keyup", searchKeyPressHandler);
  }, []);

  useEffect(() => {
    if (state.searchTerm.trim()) {
      setState((draft) => {
        draft.show = "loading";
      });
      const delay = setTimeout(() => {
        setState((draft) => {
          draft.requestCount++;
        });
      }, 700);

      return () => clearTimeout(delay);
    } else {
      setState((draft) => {
        draft.show = "neither";
      });
    }
  }, [state.searchTerm]);

  useEffect(() => {
    if (state.requestCount) {
      const request = Axios.CancelToken.source();
      async function getSearchResult() {
        try {
          const response = await Axios.post("/search", { searchTerm: state.searchTerm }, { cancelToken: request.token });
          setState((draft) => {
            draft.results = response.data;
            draft.show = "results";
          });
        } catch (e) {
          appDispatch({ type: "flashMessage", value: ["alert-danger", "Could not get results"] });
          <NetworkError/>
        }
      }
      getSearchResult();
      return () => request.cancel();
    }
  }, [state.requestCount]);

  function searchKeyPressHandler(e) {
    if (e.keyCode == 27) {
      appDispatch({ type: "closeSearch" });
    }
  }

  function inputHandler(e) {
    const value = e.target.value;
    setState((draft) => {
      draft.searchTerm = value;
    });
  }

  return (
    <div>
      <div className="search-overlay-top shadow-sm">
        <div className="container container--narrow">
          <label htmlFor="live-search-field" className="search-overlay-icon">
            <i className="fas fa-search"></i>
          </label>
          <input onChange={inputHandler} autoFocus type="text" autoComplete="off" id="live-search-field" className="live-search-field" placeholder="What are you interested in?" />
          <span onClick={() => appDispatch({ type: "closeSearch" })} className="close-live-search">
            <i className="fas fa-times-circle"></i>
          </span>
        </div>
      </div>

      <div className="search-overlay-bottom">
        <div className="container container--narrow py-3">
          <div className={"circle-loader " + (state.show === "loading" ? "circle-loader--visible" : "")}></div>
          <div className={"live-search-results" + (state.show === "results" ? "live-search-results--visible" : "")}>
            {Boolean(state.results.length) && (
              <div className="list-group shadow-sm">
                <div className="list-group-item active">
                  <strong>Results</strong> ({state.results.length} {state.results.length > 1 ? "items" : "item"} found)
                </div>
                {state.results.map((post) => {
                  return <Post post={post} key={post._id} onClick={() => appDispatch({ type: "closeSearch" })} />;
                })}
              </div>
            )}
            {!Boolean(state.results.length) && (
              <div className="alert alert-danger text-center shadow-sm">
                <i className="mb-3 far fa-frown fa-9x"></i>
                <p>Sorry, we can't seem to find what you are looking for. Try searching something else.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Search;
