import Axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import LoadingIcon from "./LoadingIcon";

function ProfilePosts() {
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {

    const ourCancelToken = Axios.CancelToken.source();
    async function fetchPosts() {
      try {
        const response = await Axios.get(`/profile/${username}/posts`, {cancelToken: ourCancelToken.token});
        setPosts(response.data);
        setIsLoading(false);
      } catch (e) {
        setIsLoading(true);
        console.log("[Error] Couldn't load posts or the request was cancelled");
      }
    }
    fetchPosts();

    return (() => {
      ourCancelToken.cancel();
    })
  }, []);

  if (isLoading) return <LoadingIcon />;

  return (
    <div className="list-group">
      {posts.map((post) => {
        const date = new Date(post.createdDate);
        const dateFormated = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

        return (
          <Link key={post._id} to={`/posts/${post._id}`} className="list-group-item list-group-item-action">
            <img className="avatar-tiny" src={post.author.avatar} alt="avatar of creator of post #1" /> <strong>{post.title}</strong>
            <span className="text-muted small"> on {dateFormated}</span>
          </Link>
        );
      })}
    </div>
  );
}

export default ProfilePosts;
