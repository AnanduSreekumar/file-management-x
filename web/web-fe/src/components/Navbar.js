import React, { useState } from "react";
import services from "../services";
import { useNavigate } from "react-router-dom";

const Navbar = (props) => {
  const [user, setUser] = useState(localStorage.getItem("email"));
  let navigate = useNavigate();
  const { username } = props;
  const redirect = () => {
    return navigate("/auth");
  };

  const logout = () => {
    services.getLogout();
    return redirect();
  };
  return (
    <nav class="navbar navbar-expand-lg bg-body-tertiary " data-bs-theme="dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="/filemanager">
          One-D
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarText"
          aria-controls="navbarText"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarText">
          {user && (
            <>
              <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                  <a
                    class="nav-link active"
                    aria-current="page"
                    href="/filemanager"
                  >
                    Home
                  </a>
                </li>
              </ul>
              <span class="navbar-text text-light mx-3">{user}</span>
              <button type="button" class="btn btn-danger" onClick={logout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
