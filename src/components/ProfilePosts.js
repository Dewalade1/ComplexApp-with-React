import Axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";

import Post from "./Post";
import LoadingIcon from "./LoadingIcon";
import DispatchContext from "../DispatchContext";
import NetworkError from "./NetworkError";

function ProfilePosts() {
  const { username } = useParams();
  const appDispatch = useContext(DispatchContext);
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const ourCancelToken = Axios.CancelToken.source();
    async function fetchPosts() {
      try {
        const response = await Axios.get(`/profile/${username}/posts`, { cancelToken: ourCancelToken.token });
        setPosts(response.data);
        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
        appDispatch({ type: "flashMessage", value: ["alert-danger", `Couldn't fetch ${username}'s posts. Please check your network connection`] });
        return <NetworkError/>;
      }
    }

    fetchPosts();
    return () => ourCancelToken.cancel();
  }, [username]);

  if (isLoading) return <LoadingIcon />;

  return (
    <div className="list-group">
      {posts.map((post) => {
        return <Post post={post} key={post._id} author={true}/>
      })}
      {!Boolean(posts.length) && (
        <div className="alert alert-secondary text-center shadow-sm">
          <i className="mb-3 far fa-frown fa-9x"></i>
          <p>
            This is a surprise, looks like {username} hasn't made a post yet.
          </p>
        </div>
      )}
    </div>
  );
}

export default ProfilePosts;
