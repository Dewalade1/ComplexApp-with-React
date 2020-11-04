import Axios from "axios";
import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useImmerReducer } from "use-immer";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";

import Page from "./Page";
import LoadingIcon from "./LoadingIcon";

function EditPost() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  const originalState = {
    title: {
      value: "",
      hasErrors: false,
      errorMessage: "",
    },
    body: {
      value: "",
      hasErrors: false,
      errorMessage: "",
    },
    fetchingData: true,
    isSaving: false,
    id: useParams().id,
    sendCount: 0,
    EditButtonText: "Save Edit",
  };
  function ourReducer(draft, action) {
    switch (action.type) {
      case "fetchComplete":
        draft.title.value = action.value.title;
        draft.body.value = action.value.body;
        draft.fetchingData = false;
        break;
      case "titleChange":
        draft.title.hasErrors = false;
        draft.title.value = action.value;
        draft.title.errorMessage = "";
        break;
      case "bodyChange":
        draft.body.hasErrors = false;
        draft.body.value = action.value;
        draft.body.errorMessage = "";
        break;
      case "submitRequest":
        if (!draft.title.hasErrors && !draft.body.hasErrors) {
          draft.sendCount++;
          draft.EditButtonText = "Saving...";
        }
        break;
      case "saveResquestStarted":
        draft.isSaving = true;
        break;
      case "saveRequestFinished":
        draft.isSaving = false;
        draft.EditButtonText = "Save Edit";
        break;
      case "bodyRules":
        if (!action.value.trim()) {
          draft.body.hasErrors = true;
          draft.body.errorMessage = "Post must contain a body";
        }
        break;
      case "titleRules":
        if (!action.value.trim()) {
          draft.title.hasErrors = true;
          draft.title.errorMessage = "Title field cannot be empty";
        }
        break;
      default:
        return draft;
    }
  }
  const [state, dispatch] = useImmerReducer(ourReducer, originalState);

  function handleSubmit(e) {
    e.preventDefault();
    dispatch({ type: "titleRules", value: state.title.value });
    dispatch({ type: "bodyRules", value: state.body.value });
    dispatch({ type: "submitRequest" });
  }

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

  useEffect(() => {
    if (state.sendCount) {
      dispatch({ type: "saveRequestStarted" });
      const ourRequest = Axios.CancelToken.source();

      async function sendPost() {
        try {
          await Axios.post(`/post/${state.id}/edit`, { title: state.title.value, body: state.body.value, token: appState.user.token }, { cancelToken: ourRequest.token });
          dispatch({ type: "saveRequestFinished" });
          appDispatch({ type: "flashMessage", value: "Update Successful!" });
        } catch (e) {
          console.log("[Error] Post could not be sent or the request was cancelled");
        }
      }
      sendPost();

      return () => {
        ourRequest.cancel();
      };
    }
  }, [state.sendCount]);

  if (state.fetchingData)
    return (
      <Page title="Post">
        {" "}
        <LoadingIcon />
      </Page>
    );

  return (
    <Page title="Edit post">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input onBlur={(e) => dispatch({ type: "titleRules", value: e.target.value })} onChange={(e) => dispatch({ type: "titleChange", value: e.target.value })} autoFocus value={state.title.value} name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
          {state.title.hasErrors && <div className="alert alert-danger small liveValidateMessage"> {state.title.errorMessage}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea onBlur={(e) => dispatch({ type: "bodyRules", value: e.target.value })} onChange={(e) => dispatch({ type: "bodyChange", value: e.target.value })} value={state.body.value} name="body" id="post-body" className="body-content tall-textarea form-control" type="text" />
          {state.body.hasErrors && <div className="alert alert-danger small liveValidateMessage"> {state.body.errorMessage}</div>}
        </div>

        <button className="btn btn-outline-secondary" disabled={state.isSaving}>
          {state.EditButtonText}
        </button>
      </form>
    </Page>
  );
}

export default EditPost;
