// import "./Auth.scss";

import { useState } from "react";

import util from "../util/helpers";
import services from "../services";

const performLogin = (email, pass) => {
  // util.setLoggedIn("rahul.pillai03");
  // window.location = "/";
  services.getLogin(email, pass);
  // window.location = "/";
};
const createAccount = (firstname, lastname, email, pass) => {
  services.postCreateAccount(firstname, lastname, email, pass);
};

function Auth() {
  document.body.style.backgroundColor = "#474747";
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  return (
    <div class="row ">
      <div class="col-4"></div>
      <div
        className="component-auth col-4 mt-5 p-5"
        style={{ backgroundColor: "#edebe6", borderRadius: "15px" }}
      >
        <h1>{isSignUp ? "Create Account" : "Log into your account"}</h1>
        <ul class="nav nav-pills">
          <li class="nav-item">
            <a
              class={`nav-link ${!isSignUp && "active"}`}
              aria-current="page"
              href="#"
              onClick={() => setIsSignUp(false)}
            >
              Login
            </a>
          </li>
          <li class="nav-item">
            <a
              class={`nav-link ${isSignUp && "active"}`}
              href="#"
              onClick={() => setIsSignUp(true)}
            >
              Register
            </a>
          </li>
        </ul>
        {!isSignUp && (
          <div class="mt-3">
            <label for="formGroupExampleInput" class="form-label">
              Email
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              class="form-control"
              id="field-email"
              placeholder="Email"
              required
            ></input>

            <label for="formGroupExampleInput" class="form-label">
              Password
            </label>
            <input
              onChange={(e) => setPass(e.target.value)}
              type="password"
              class="form-control"
              id="field-pass"
              placeholder="Password"
              required
            ></input>
            <button
              class="mt-3 btn btn-outline-primary"
              onClick={() => performLogin(email, pass)}
            >
              Sign-in
            </button>
          </div>
        )}

        {isSignUp && (
          <div class="mt-3">
            <label for="formGroupExampleInput" class="form-label">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              class="form-control"
              id="field-email"
              placeholder="Email"
              required
            ></input>
            <label for="formGroupExampleInput" class="form-label">
              Firstname
            </label>
            <input
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              type="firstname"
              class="form-control"
              id="field-firstname"
              placeholder="First Name"
              required
            ></input>
            <label for="formGroupExampleInput" class="form-label">
              Lastname
            </label>
            <input
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              type="text"
              class="form-control"
              id="field-lastname"
              placeholder="Last Name"
              required
            ></input>
            <label for="formGroupExampleInput" class="form-label">
              Password
            </label>
            <input
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              type="password"
              class="form-control"
              id="field-pass-retype"
              placeholder="Password"
              required
            ></input>
            <label for="formGroupExampleInput" class="form-label">
              Re-type Password
            </label>
            <input
              value={pass2}
              onChange={(e) => setPass2(e.target.value)}
              type="password"
              class="form-control"
              id="field-pass-retype"
              placeholder="Re-type Password"
              required
            ></input>
            <button
              class={`btn btn-outline-primary mt-3 ${
                pass != pass2 && "disabled"
              }`}
              onClick={() => createAccount(firstname, lastname, email, pass)}
            >
              Sign-up
            </button>
          </div>
        )}
      </div>
      <div class="col-4"></div>
    </div>
  );
}

export default Auth;
