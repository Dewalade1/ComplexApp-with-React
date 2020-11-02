import Axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";

import Page from "./Page";
import LoadingIcon from "./LoadingIcon";

function ViewSinglePost() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState();

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();

    async function fetchPost() {
      try {
        const response = await Axios.get(`/post/${id}`, { cancelToken: ourRequest.token });
        setPost(response.data);
        setIsLoading(false);
      } catch (e) {
        console.log("[Error] Post cannot be displayed or the request was cancelled");
      }
    }
    fetchPost();

    return () => {
      ourRequest.cancel();
    };
  }, []);

  if (isLoading)
    return (
      <Page title="Post">
        {" "}
        <LoadingIcon />
      </Page>
    );

  const date = new Date(post.createdDate);
  const formatedDate = `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`;

  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        <span className="pt-2">
          <Link to="#" className="text-primary mr-2" title="Edit">
            <i className="fas fa-edit"></i>
          </Link>
          <Link className="delete-post-button text-danger" title="Delete">
            <i className="fas fa-trash"></i>
          </Link>
        </span>
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img className="avatar-tiny" src={post.author.avatar} alt="Post Creator's avatar" />
        </Link>{" "}
        <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link> | {formatedDate}
      </p>

      <div className="body-content">
        <ReactMarkdown source={post.body} allowedTypes={["paragraph", "strong", "emphasis", "text", "Heading", "list", "listItem"]}/>
      </div>
    </Page>
  );
}

export default ViewSinglePost;
