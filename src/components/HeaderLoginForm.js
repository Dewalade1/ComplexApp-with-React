import Axios from "axios";
import React, { useState } from "react";

function HeaderLoginForm() {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const response = await Axios.post("http://localhost:8080/login", { username, password });

      if (response.data) {
        console.log(response.data);
      } else {
        console.log("[Error] incorrect username or password.");
      }
    } catch (e) {
      console.log("[Error] Couldn't Log user in");
    }
  }

  return (
    <form onSubmit={handleLogin} className="mb-0 pt-2 pt-md-0">
      <div className="row align-items-center">
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input onChange={(e) => setUsername(e.target.value)} name="username" className="form-control form-control-sm input-dark" type="text" placeholder="Username" autoComplete="off" />
        </div>
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input onChange={(e) => setPassword(e.target.value)} name="password" className="form-control form-control-sm input-dark" type="password" placeholder="Password" autoComplete="off" />
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
