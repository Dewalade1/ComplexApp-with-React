import React from "react";

function NetworkError() {
  return (
    <div className="mt-6 alert alert-danger text-center shadow-sm">
      <i className="mb-3 far fa-frown fa-9x"></i>
      <p>Seems we can't find anything on {username}'s followers.</p>
      <p> Kindly check your network connection</p>
    </div>
  );
}

export default NetworkError;
