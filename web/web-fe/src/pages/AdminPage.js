import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

import { AiFillDelete } from "react-icons/ai";
import axios from "axios";
import constants from "../util/constants";
import { ProgressBar } from "react-bootstrap";
import { Link } from "react-router-dom";

const AdminPage = () => {
  document.body.style.backgroundColor = "#edebe6";
  const [data, setData] = useState([]);
  const [uploaded, setUploaded] = useState(0);
  const [deleted, setDeleted] = useState(0);
  const [modified, setModified] = useState(0);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .post(constants.BASE_URL + "/filemanager", {
        email: localStorage.getItem("email"),
      })
      .then((response) => {
        console.log(response);
        setData(response.data.data);
        setDeleted(response.data.file_deleted);
        setModified(response.data.file_modified);
        setUploaded(response.data.file_insert);
      });
    axios
      .post(constants.BASE_URL + "/listusers", {
        email: localStorage.getItem("email"),
      })
      .then((response) => {
        console.log(response);
        setUsers(response.data.data);
      });
  }, []);

  return (
    <>
      <Navbar username="Admin" />

      <div class="container mt-5">
        <div class="row">
          <div class="col-12 mb-5">
            <div>
              <ProgressBar style={{ height: "30px" }}>
                <ProgressBar
                  animated
                  striped
                  variant="success"
                  label="uploaded"
                  now={`${(uploaded / data.length) * 100}`}
                  key={1}
                />
                <ProgressBar
                  animated
                  striped
                  variant="warning"
                  now={`${(modified / data.length) * 100}`}
                  label="modified"
                  key={2}
                />
                <ProgressBar
                  animated
                  striped
                  variant="danger"
                  label="deleted"
                  now={`${(deleted / data.length) * 100}`}
                  key={3}
                />
              </ProgressBar>
            </div>
          </div>
          <div class="col-12">
            <div class="card">
              <div class="card-header">
                <h5 class="card-title mb-2 mb-md-0 text-dark-m3">
                  Files
                  <span class="badge bg-secondary mx-2">{data.length}</span>
                </h5>
              </div>
              <div class="card-body">
                <div
                  class="table-responsive"
                  id="proTeamScroll"
                  tabindex="2"
                  style={{
                    overflow: "hidden",
                    outline: "none",
                  }}
                >
                  <table class="table table-striped">
                    <thead>
                      <tr>
                        <th>File name</th>
                        <th>Last modified date</th>
                        <th>User</th>

                        <th>Status</th>
                        <th>Edit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.length !== 0 &&
                        data.map((row, index) => (
                          <tr key={index}>
                            <td>
                              <p class="m-0">{row[1]}</p>
                            </td>
                            <td>{row[7]}</td>

                            <td>
                              <div class="badge-outline col-red">{row[4]}</div>
                            </td>
                            <td class="align-middle">
                              {row[5] === "DELETE" && (
                                <span class="badge bg-danger">Deleted</span>
                              )}
                              {row[5] === "MODIFIED" && (
                                <span class="badge bg-warning">Modified</span>
                              )}
                              {row[5] === "INSERT" && (
                                <span class="badge bg-success">Uploaded</span>
                              )}
                            </td>
                            <td>
                              {row[5] !== "DELETE" && (
                                <Link to={`/admindelete/${row[0]}`} state={row}>
                                  <button
                                    type="button"
                                    class="btn btn-danger btn-sm"
                                  >
                                    <AiFillDelete />
                                  </button>
                                </Link>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 mt-5">
            <div class="card">
              <div class="card-header">
                <h5 class="card-title mb-2 mb-md-0 text-dark-m3">
                  Users
                  <span class="badge bg-secondary mx-2">{users.length}</span>
                </h5>
              </div>
              <div class="card-body">
                <div
                  class="table-responsive"
                  id="proTeamScroll"
                  tabindex="2"
                  style={{
                    overflow: "hidden",
                    outline: "none",
                  }}
                >
                  <table class="table table-striped align-middle">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Email id</th>

                        <th>Files Uploaded</th>
                        <th>Files Deleted</th>
                        {/* <th>Edit</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((row, index) => (
                        <tr key={index}>
                          <td>
                            <p class="m-0"> {row[0]}</p>
                          </td>
                          <td>
                            <div class="badge-outline col-red">{row[3]}</div>
                          </td>
                          <td class="align-middle text-center">{row[1]}</td>
                          <td class="align-middle text-center">{row[2]}</td>
                          {/* <td>
                            <Link to={`/deleteuser/${row[0]}`} state={row}>
                              <button
                                type="button"
                                class="btn btn-danger btn-sm"
                              >
                                <AiFillDelete />
                              </button>
                            </Link>
                          </td> */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPage;
