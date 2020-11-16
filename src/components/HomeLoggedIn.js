import Axios from "axios";
import {Link} from "react-router-dom";
import { useImmer } from "use-immer";
import React, { useContext, useEffect } from "react";

import Page from "./Page";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
import NetworkError from "./NetworkError";
import LoadingIcon from "./LoadingIcon";

function HomeLoggedIn() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const [state, setState] = useImmer({
    isLoading: true,
    feed: [],
  });

  useEffect(() => {
    const feedRequest = Axios.CancelToken.source();
    const fetchFeed = async function () {
      try {
        const response = await Axios.post("/getHomeFeed", {token: appState.user.token, cancelToken: feedRequest.token });
        setState(draft => {
          draft.isLoading = false;
          draft.feed = response.data;
        });
      } catch (e) {
        if (e != "Cancel") {
          setState(draft => {
            draft.isLoading = false;
          });
          appDispatch({ type: "flashMessage", value: ["alert-danger", `Sorry, Could not fetch your feed`] });
          return <NetworkError />;
        }
      }
    };

    fetchFeed();
    return () => feedRequest.cancel();
  }, []);
  if (state.isLoading) return <LoadingIcon/>;

  return (
    <Page title={"Your feed "}>
      {state.feed.length > 0 && (
        <>
          <h2 className="icon text-left mb-4">Here's what's been happening...</h2>
          <div className="list-group">
            {state.feed.map((post) => {
              const date = new Date(post.createdDate);
              const formatedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
              return (
                <Link key={post._id} to={`/posts/${post._id}`} onClick={() => appDispatch({ type: "closeSearch" })} className="list-group-item list-group-item-action list-group-item-info">
                  <img className="avatar-small border border-dark" src={post.author.avatar} alt={`${post.author.username}'s avatar`} /> <strong>{post.title}</strong>
                  <span className="text-muted small">
                    {" |  "}
                     {post.author.username} on {formatedDate}
                  </span>
                  <p className="mt-3">{post.body}</p>
                </Link>
              );
            })}
          </div>
        </>
      )}
      {!Boolean(state.feed.length) && (
        <>
          <div className="text-center">
            <i className="icon mb-3 far fa-frown fa-7x"></i>
            <h2>
              Hello <strong>{appState.user.username}</strong>, your feed is empty.
            </h2>
          </div>
          <p className="lead text-muted text-center">Your feed displays the latest posts from the people you follow. If you don&rsquo;t have any friends to follow that&rsquo;s okay; you can use the &ldquo;Search&rdquo; feature in the top menu bar to find content written by people with similar interests and then follow them.</p>
        </>
      )}
    </Page>
  );
}

export default HomeLoggedIn;
