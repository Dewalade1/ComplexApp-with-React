import React from "react";
import { Link } from "react-router-dom";

function Post(props) {
  const post = props.post;
  const date = new Date(post.createdDate);
  const formatedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  return (
    <Link to={`/posts/${post._id}`} onClick={props.onClick} className="list-group-item list-group-item-action list-group-item-info">
      <img className="avatar-small border border-dark" src={post.author.avatar} alt={`${post.author.username}'s avatar`} /> <strong>{post.title}</strong>
      <span className="text-muted small">
        {" |  "}
        {!props.author && <>{post.author.username} on</>} {formatedDate}
      </span>
      {props.content ? <p className="mt-3">{props.content}</p> : ""}
    </Link>
  );
}

export default Post;
