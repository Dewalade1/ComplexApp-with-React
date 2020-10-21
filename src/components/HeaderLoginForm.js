import React from "react";

function HeaderLoginForm() {
  return (
    <form className="mb-0 pt-2 pt-md-0">
      <div className="row align-items-center">
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input name="username" className="form-control form-control-sm input-dark" type="text" placeholder="Username" autoComplete="off" />
        </div>
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input name="password" className="form-control form-control-sm input-dark" type="password" placeholder="Password" autoComplete="off" />
        </div>
        <div className="col-md-auto">
          <button className="btn btn-success btn-sm">
            Sign In <i className="fas fa-sign-in-alt"></i>
          </button>
        </div>
      </div>
    </form>
  );
}

export default HeaderLoginForm;
