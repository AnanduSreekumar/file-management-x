import React from "react";
import Navbar from "../components/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import constants from "../util/constants";

const UserDelete = () => {
  const location = useLocation();
  const state = location.state;
  let navigate = useNavigate();
  document.body.style.backgroundColor = "#edebe6";

  const deletefile = (e) => {
    e.preventDefault();
    let email = state[3];
    axios
      .delete(constants.BASE_URL + `/deleteUser/${email}}`)
      .then((response) => {
        console.log(response);
        return navigate("/admin");
      });
  };
  return (
    <>
      <Navbar />
      <div class="row ">
        <div class="col-4"></div>
        <div
          className="component-auth col-4 mt-5 p-5 text-center"
          style={{ backgroundColor: "#ffffff", borderRadius: "15px" }}
        >
          <h1>Warning! </h1>
          <div class="mt-3 text-center">
            <p class="mt-3">
              Are you sure want to delete <p>{state[0]} ?</p>
            </p>
            <button class={`btn btn-danger `} onClick={deletefile}>
              Confirm
            </button>
          </div>
        </div>
        <div class="col-4"></div>
      </div>
    </>
  );
};

export default UserDelete;
