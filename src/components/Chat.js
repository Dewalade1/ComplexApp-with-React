import io from "socket.io-client";
import { Link } from "react-router-dom";
import { useImmer } from "use-immer";
import React, { useContext, useRef, useEffect } from "react";

import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";

function Chat() {
  const chatField = useRef(null);
  const chatLog = useRef(null);
  const socket = useRef(null);

  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const [state, setState] = useImmer({
    fieldValue: "",
    chatMessages: [],
  });

  useEffect(() => {
    if (appState.isChatOpen) {
      chatField.current.focus();
      appDispatch({ type: "clearUnreadMessageCount" });
    }
  }, [appState.isChatOpen]);

  useEffect(() => {
    socket.current = io("https://backend-for-complexapp.herokuapp.com" || process.env.BACKENDURL);
    socket.current.on("chatFromServer", (message) => {
      setState((draft) => {
        draft.chatMessages.push(message);
      });
    });

    return () => socket.current.disconnect();
  }, []);

  useEffect(() => {
    chatLog.current.scrollTop = chatLog.current.scrollHeight;
    if (state.chatMessages.length && appState.isChatOpen) {
      appDispatch({ type: "incrementUnreadMessageCount" });
    }
  }, [state.chatMessages]);

  function fieldChangeHandler(e) {
    const value = e.target.value;
    setState((draft) => {
      draft.fieldValue = value;
    });
  }

  function submitHandler(e) {
    e.preventDefault();
    socket.current.emit("chatFromBrowser", { message: state.fieldValue, token: appState.user.token });

    setState((draft) => {
      draft.chatMessages.push({ message: draft.fieldValue, username: appState.user.username, avatar: appState.user.avatar });
      draft.fieldValue = "";
    });
  }

  return (
    <div id="chat-wrapper" className={"chat-wrapper shadow border-top border-left border-right " + (appState.isChatOpen ? "chat-wrapper--is-visible" : "")}>
      <div className="chat-title-bar bg-primary">
        Chat
        <span onClick={() => appDispatch({ type: "closeChat" })} className="chat-title-bar-close">
          <i className="fas fa-times-circle"></i>
        </span>
      </div>
      <div id="chat" className="chat-log" ref={chatLog}>
        {state.chatMessages.map((message, index) => {
          if (message.username == appState.user.username) {
            return (
              <div key={index} className="chat-self">
                <div className="chat-message">
                  <div className="chat-message-inner">
                    <Link to={`/profile/${message.username}`}>
                      <strong>You:</strong>
                    </Link>
                    {message.message}
                  </div>
                </div>
                <Link to={`/profile/${message.username}`}>
                  <img className="chat-avatar avatar-tiny" src={message.avatar} />
                </Link>
              </div>
            );
          }
          return (
            <div key={index} className="chat-other">
              <Link to={`/profile/${message.username}`}>
                <img className="avatar-tiny" src={message.avatar} />
              </Link>
              <div className="chat-message">
                <div className="chat-message-inner">
                  <Link to={`/profile/${message.username}`}>
                    <strong>{message.username}: </strong>
                  </Link>
                  {message.message}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <form id="chatForm" className="chat-form border-top" onSubmit={submitHandler}>
        <input value={state.fieldValue} ref={chatField} onChange={fieldChangeHandler} type="text" className="chat-field" id="chatField" placeholder="Type a message…" autoComplete="off" />
      </form>
    </div>
  );
}

export default Chat;
