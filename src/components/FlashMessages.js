import React from "react";

function FlashMessages(props) {
  return (
    <div className="floating-alerts">
      {props.messages.content.map((msg, index) => {
        return (
          <div key={index} className={`alert ${props.messages.class} text-center floating-alert shadow-sm`}>
            {msg}
          </div>
        );
      })}
    </div>
  );
}

export default FlashMessages;
