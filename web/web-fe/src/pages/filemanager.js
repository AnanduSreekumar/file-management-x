import React, { useEffect, useState } from "react";
import axios from "axios";
import constants from "../util/constants";
import Navbar from "../components/Navbar";
import File from "../components/File";
import { Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Filemanager() {
  document.body.style.backgroundColor = "#edebe6";
  document.body.style.margin = "0";
  let navigate = useNavigate();
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);
  const [fileDesc, setFileDesc] = useState("");
  const [user, setUser] = useState(localStorage.getItem("email"));

  const userAuthenticated = () => {
    console.log(typeof localStorage.getItem("email"));
    setUser(localStorage.getItem("email"));
  };
  const redirect = () => {
    return navigate("/auth");
  };
  const adminRedirect = () => {
    return navigate("/admin");
  };

  useEffect(() => {
    axios
      .post(constants.BASE_URL + "/filemanager", {
        email: localStorage.getItem("email"),
      })
      .then((response) => {
        console.log(response);
        setData(response.data.data);
      });
  }, []);
  useEffect(() => {
    userAuthenticated();

    console.log(user);
    if (!user) {
      redirect();
    } else if (user === "one_d@admin.com") {
      return navigate("/admin");
    }
  }, [user]);

  const deleteRow = (file_name) => {
    axios
      .delete(
        constants.BASE_URL +
          `/deletefileS3/${localStorage.getItem("email")}/${file_name}`
      )
      .then(() => {
        setData(data.filter((item) => item.file_name !== file_name));
      });
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
  const [show, setShow] = useState(false);

  const handleUpload = (e) => {
    e.preventDefault();
    // if (file && fileDesc) {
    //   console.log(file, fileDesc);
    // } else {
    //   setShow(true);
    // }
    if (file && fileDesc) {
      let formData = new FormData();
      formData.append("file", file);
      formData.append("description", fileDesc);
      formData.append("email", localStorage.getItem("email"));
      try {
        axios
          .post(constants.BASE_URL + "/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            console.log(response);
            if (response.status === 200) {
              // window.location.reload();
            }
          })
          .catch(function (error) {
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              setShow(true);
            }
          });
      } catch {
        setShow(true);
      }
    } else {
      setShow(true);
    }
  };

  return (
    <div class="">
      <Navbar username={user} />

      <div data-bs-theme="dark ">
        <div class="align-items-center mt-5" style={{ width: "100%" }}>
          <div class="container " style={{ width: "90%" }}>
            {show && (
              <Alert
                variant="danger"
                onClose={() => setShow(false)}
                dismissible
              >
                <Alert.Heading>Oh snap! Invalid file!</Alert.Heading>
                <p>Enter file and file description</p>
              </Alert>
            )}
            <div class="row  align-items-end p-3" style={{ margin: "auto" }}>
              <div class="col-3 text-right"></div>
              <div class="col-3">
                <label for="exampleFormControlTextarea1" class="form-label">
                  Description
                </label>
                <textarea
                  class="form-control"
                  value={fileDesc}
                  onChange={(e) => setFileDesc(e.target.value)}
                  rows="1"
                  style={{ height: "50%" }}
                ></textarea>
              </div>
              <div class="col-3">
                <label for="formFile" class="form-label">
                  File input
                </label>
                <input
                  class="form-control"
                  type="file"
                  id="formFile"
                  onChange={handleFileChange}
                  style={{ height: "50%" }}
                />
              </div>

              <div class="col-3">
                <button
                  type="button"
                  class="btn btn-secondary"
                  onClick={handleUpload}
                  style={{ backgroundColor: "#2B3036" }}
                >
                  Upload file {">>"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row text-center mt-5" style={{ width: "100%" }}>
        <div className="col-10" style={{ width: "100%", margin: "auto" }}>
          {data.length === 0 ? (
            <p>There are no files to show...</p>
          ) : (
            <File data={data} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Filemanager;
