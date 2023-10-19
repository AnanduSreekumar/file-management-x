import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import constants from "../util/constants";
import { Alert } from "react-bootstrap";

const EditFile = () => {
  const location = useLocation();
  const state = location.state;
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState(state[2]);
  const [show, setShow] = useState(false);
  let navigate = useNavigate();
  document.body.style.backgroundColor = "#edebe6";

  const fileUpdate = (e) => {
    e.preventDefault();
    if (file) {
      let formData = new FormData();
      formData.append("file", file);
      formData.append("filename", state[1]);
      formData.append("description", description);
      formData.append("email", localStorage.getItem("email"));

      let email = localStorage.getItem("email");
      axios
        .post(constants.BASE_URL + `/modifyfileS3/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log(response);
          return navigate("/filemanager");
        });
    } else {
      setShow(true);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0].size > 10485760) {
      // 10 MB in bytes
      alert("File size should be less than or equal to 10 MB");
      setFile(null);
    } else {
      setFile(e.target.files[0]);
    }
  };
  return (
    <>
      <Navbar />
      <div class="row ">
        <div class="col-4"></div>
        <div
          className="component-auth col-4 mt-5 p-5"
          style={{ backgroundColor: "#ffffff", borderRadius: "15px" }}
        >
          {show && (
            <Alert variant="danger" onClose={() => setShow(false)} dismissible>
              <Alert.Heading>Oh snap! Invalid file!</Alert.Heading>
            </Alert>
          )}
          <h1>Edit </h1>
          <p>{state[1]}</p>
          <div class="mt-3">
            <label for="formFile" class="form-label">
              File
            </label>
            <input
              class="form-control"
              type="file"
              id="formFile"
              onChange={handleFileChange}
            />
            <label for="exampleFormControlTextarea1" class="form-label">
              Description
            </label>
            <textarea
              class="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="2"
            ></textarea>
            <p class="mt-3">Last modified: {state[6]}</p>
            <button class={`btn btn-secondary `} onClick={fileUpdate}>
              Submit
            </button>
          </div>
        </div>
        <div class="col-4"></div>
      </div>
    </>
  );
};

export default EditFile;
