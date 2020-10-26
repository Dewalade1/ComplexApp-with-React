import React, { useContext, useState } from "react";
import Axios from "axios";
import { withRouter } from "react-router-dom";

import Page from "./Page";
import DispatchContext from "../DispatchContext";

function CreatePost(props) {
  const [title, setTitle] = useState();
  const [body, setBody] = useState();
  const appDispatch = useContext(DispatchContext);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await Axios.post("/create-post", { token: localStorage.getItem("userToken"), title, body });
      appDispatch({ type: "flashMessage", value: "Post Successful!" });
      props.history.push(`/posts/${response.data}`);
      console.log("[Success] New post was made!");
    } catch (e) {
      console.log("[Error] Could not post your new post.");
    }
  }
  return (
    <Page title="Create a new post">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input onChange={(e) => setTitle(e.target.value)} autoFocus name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea onChange={(e) => setBody(e.target.value)} name="body" id="post-body" className="body-content tall-textarea form-control" type="text"></textarea>
        </div>

        <button className="btn btn-primary">
          <i class="fas fa-check"></i> Save New Post
        </button>
      </form>
    </Page>
  );
}

export default withRouter(CreatePost);
