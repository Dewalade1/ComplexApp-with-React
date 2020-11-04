import React from "react";
import { Link } from "react-router-dom";

import Page from "./Page";

function PageNotFound() {
  return (
    <Page title="Page Not Found">
      {" "}
      <div className="mb-3 text-center">
        <i className="icon far fa-frown fa-9x"></i>
      </div>
      <div className="text-center">
        <h2>
          <b>Whoops!! Page not found</b>
        </h2>
        <p className="lead text-muted">
          {" "}
          No worries, you can always visit the <Link to="/">homepage</Link> to get a fresh start. You can do this by clicking the complexapp logo on the top left of your screen or by clicking <Link to="/">here</Link>
        </p>
      </div>
    </Page>
  );
}

export default PageNotFound;
