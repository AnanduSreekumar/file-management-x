// import "./Auth.scss";

import { useState } from "react";

import util from "../util/helpers";
import services from "../services";
import Navbar from "../components/Navbar";
import { Alert } from "react-bootstrap";
import axios from "axios";
import constants from "../util/constants";
import { authenticate } from "../services/authenticate";
import { CognitoUser, CognitoUserAttribute } from "amazon-cognito-identity-js";
import userpool from "../util/userpool";

function Auth() {
  document.body.style.backgroundColor = "#edebe6";
  const [show, setShow] = useState(false);
  const [sushow, susetShow] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [err, setErr] = useState("");
  const [verifyProcess, setVerifyProcess] = useState(false);
  const [OTP, setOTP] = useState("");

  const verifyAccount = (e) => {
    e.preventDefault();
    const user = new CognitoUser({
      Username: email,
      Pool: userpool,
    });
    console.log(user);
    user.confirmRegistration(OTP, true, (err, data) => {
      if (err) {
        console.log(err);
        alert("Couldn't verify account");
      } else {
        console.log(data);
        // alert("Account verified successfully");
        window.location.href = "/auth";
      }
    });
  };
  const createAccount = () => {
    const attributeList = [];
    attributeList.push(
      new CognitoUserAttribute({
        Name: "email",
        Value: email,
      })
    );
    let username = email;
    userpool.signUp(username, pass, attributeList, null, (err, data) => {
      if (err) {
        console.log(err);
        susetShow(true);
      } else {
        console.log(data);
        // alert("user added successfully");
        setVerifyProcess(true);
        // Navigate("/files");
      }
    });
    axios
      .post(constants.BASE_URL + constants.PATHS.CREATE_ACCOUNT, {
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: pass,
      })
      .then(function (response) {
        console.log(response);
        // window.location = "/auth";
      })
      .catch(function (error) {
        console.log(error);
        susetShow(true);
      });
  };

  const performLogin = () => {
    if (email.includes("admin.com")) {
      axios
        .get(constants.BASE_URL + constants.PATHS.LOGIN, {
          params: {
            email,
            password: pass,
          },
        })
        .then(function (response) {
          console.log(response);
          if (response.status === 200) {
            localStorage.setItem("email", email);
            window.location = "/admin";
          }
        })
        .catch(function (error) {
          console.log(error);
          setErr(err);
          setShow(true);
        });
    }
    authenticate(email, pass)
      .then(
        (data) => {
          console.log(data);
          localStorage.setItem("email", email);
          window.location = "/filemanager";
        },
        (err) => {
          console.log(err);
          setShow(true);
        }
      )
      .catch((err) => console.log(err));
  };
  return (
    <>
      <Navbar />
      <div class="row" style={{ alignItems: "center", height: "100vh" }}>
        <div class="col-4"></div>
        <div
          className="component-auth col-4 p-5 "
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "2px",
            boxShadow: "10px 10px 51px 0px rgba(0,0,0,0.75)",
          }}
        >
          {show && (
            <Alert variant="danger" onClose={() => setShow(false)} dismissible>
              {/* <Alert.Heading>Oh snap! You got an error!</Alert.Heading> */}
              <p>Invalid credentials!</p>
            </Alert>
          )}
          <h1 class="text-center">{isSignUp ? "Create Account" : "Login"}</h1>
          <div class="d-flex justify-content-center">
            <ul
              class="nav nav-tabs text-center d-flex justify-content-center"
              style={{ width: "100%" }}
            >
              <li class="nav-item flex-grow-1">
                <a
                  class={`nav-link text-dark ${!isSignUp && "active"}`}
                  aria-current="page"
                  href="#"
                  onClick={() => setIsSignUp(false)}
                >
                  Login
                </a>
              </li>
              <li class="nav-item flex-grow-1">
                <a
                  class={`nav-link text-dark ${isSignUp && "active"}`}
                  href="#"
                  onClick={() => setIsSignUp(true)}
                >
                  Register
                </a>
              </li>
            </ul>
          </div>
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
              <div className="row">
                <button
                  class="mt-3 btn col btn-secondary"
                  onClick={() => performLogin(email, pass)}
                >
                  Sign-in
                </button>
              </div>
            </div>
          )}

          {isSignUp && (
            <div class="mt-3">
              {sushow && (
                <Alert
                  variant="danger"
                  onClose={() => setShow(false)}
                  dismissible
                >
                  {/* <Alert.Heading>Oh snap! You got an error!</Alert.Heading> */}
                  <p>Invalid Password!</p>
                  <p>Password must contain:</p>
                  <p>Number</p>
                  <p>Uppercase letter </p>
                  <p>Lowercase letter </p>
                </Alert>
              )}
              {verifyProcess && (
                <form onSubmit={verifyAccount}>
                  Enter the OTP:
                  <input
                    type="text"
                    value={OTP}
                    class="form-control"
                    onChange={(e) => setOTP(e.target.value)}
                  />
                  <div class="row">
                    <button class="mt-3 btn col btn-secondary" type="submit">
                      Verify
                    </button>
                  </div>
                </form>
              )}
              <div className="row">
                <div className="col">
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
                </div>
                <div className="col">
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
                </div>
              </div>
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
              <div className="row">
                <button
                  class={`btn btn-secondary mt-3 col ${
                    pass != pass2 && "disabled"
                  }`}
                  onClick={() =>
                    createAccount(firstname, lastname, email, pass)
                  }
                >
                  Sign-up
                </button>
              </div>
            </div>
          )}
        </div>
        <div class="col-4"></div>
      </div>
    </>
  );
}

export default Auth;
