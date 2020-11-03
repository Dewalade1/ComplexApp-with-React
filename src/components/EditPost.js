import Axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useImmerReducer } from "use-immer";

import Page from "./Page";
import LoadingIcon from "./LoadingIcon";

function EditPost() {
  const originalState = {
    title: {
      value: "",
      errors: false,
      errorMessage: "",
    },
    body: {
      value: "",
      errors: false,
      errorMessage: "",
    },
    fetchingData: true,
    isSaving: false,
    id: useParams().id,
    sendCount: 0,
  };
  function ourReducer(draft, action) {
    switch (action.type) {
      case "fetchComplete":
        draft.title.value = action.value.title;
        draft.body.value = action.value.body;
        draft.fetchingData = false;
        break;
    }
  }
  const [state, dispatch] = useImmerReducer(ourReducer, originalState);

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();

    async function fetchPost() {
      try {
        const response = await Axios.get(`/post/${state.id}`, { cancelToken: ourRequest.token });
        dispatch({ type: "fetchComplete", value: response.data });
      } catch (e) {
        console.log("[Error] Post cannot be displayed or the request was cancelled");
      }
    }
    fetchPost();

    return () => {
      ourRequest.cancel();
    };
  }, []);

  if (state.fetchingData)
    return (
      <Page title="Post">
        {" "}
        <LoadingIcon />
      </Page>
    );

  return (
    <Page title="Edit post">
      <form>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input autoFocus value={state.title.value} name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea value={state.body.value} name="body" id="post-body" className="body-content tall-textarea form-control" type="text" />
        </div>

        <button className="btn btn-outline-secondary">
          <i className="fas fa-check"></i> Save Edit
        </button>
      </form>
    </Page>
  );
}

export default EditPost;
