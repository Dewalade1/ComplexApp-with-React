import io from "socket.io-client";
import { useImmer } from "use-immer";
import React, { useContext, useRef, useEffect } from "react";

import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";

const socket = io("https://backend-for-complexapp.herokuapp.com" || process.env.BACKENDURL);

function Chat() {
  const chatField = useRef(null);
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const [state, setState] = useImmer({
    fieldValue: "",
    chatMessages: [],
  });

  useEffect(() => {
    if (appState.isChatOpen) {
      chatField.current.focus();
    }
  }, [appState.isChatOpen]);

  useEffect(() => {
    socket.on("chatFromServer", (message) => {
      setState((draft) => {
        draft.chatMessages.push(message);
      });
    });
  }, []);

  function fieldChangeHandler(e) {
    const value = e.target.value;
    setState((draft) => {
      draft.fieldValue = value;
    });
  }

  function submitHandler(e) {
    e.preventDefault();
    socket.emit("chatFromBrowser", { message: state.fieldValue, token: appState.user.token });

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
      <div id="chat" className="chat-log">
        {state.chatMessages.map((message, index) => {
          if (message.username == appState.user.username) {
            return (
              <div key={index} className="chat-self">
                <div className="chat-message">
                  <div className="chat-message-inner">
                    <a href={`/profile/${message.username}`}>
                      <strong>You:</strong>
                    </a>
                    {message.message}
                  </div>
                </div>
                <a href={`/profile/${message.username}`}>
                  <img className="chat-avatar avatar-tiny" src={message.avatar} />
                </a>
              </div>
            );
          }
          return (
            <div key={index} className="chat-other">
              <a href={`/profile/${message.username}`}>
                <img className="avatar-tiny" src={message.avatar} />
              </a>
              <div className="chat-message">
                <div className="chat-message-inner">
                  <a href={`/profile/${message.username}`}>
                    <strong>{message.username}:</strong>
                  </a>
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
