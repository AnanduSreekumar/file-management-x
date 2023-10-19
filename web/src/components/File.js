import React, { useState } from "react";
import { BsFileEarmarkTextFill } from "react-icons/bs";
import { PiDownloadSimpleFill } from "react-icons/pi";
import { FiEdit } from "react-icons/fi";
import { AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";

const File = (props) => {
  const {data} = props

  const [mshow, setMshow] = useState(false);

  const handleClose = () => setMshow(false);
  const handleShow = () => setMshow(true);


  const deleteFile = (e, row) => {
    e.preventDefault();
    console.log(row)
  }
  return (
    <div class="container">
      <div class="container-fluid p-0">
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-header p-3">
                <h5 class="card-title">Uploaded Files</h5>
              </div>
              <div class="card-body">
                <table class="table table-striped" style={{ width: "100%" }}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Created_at</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                  {data.map((row, index) => (
              <tr key={index}>
              <td>
                <BsFileEarmarkTextFill />
              </td>
              <td >{row[1]}</td>
              <td >{row[2]}</td>
              <td>
                {row[3] === "INSERT" ? (<span class="badge bg-success">Uploaded</span>) : (<span class="badge bg-warning">Modified</span>)}
                
              </td>
              <td>{row[5]}</td>
              <td >
              <Link to={`${row[4]}`} state={row}>
                  <button
                    type="button"
                    class="btn btn-secondary btn-sm "
                  >
                    <PiDownloadSimpleFill />
                  </button>
                </Link>
                
                
                
              </td>
              <td ><Link to={`/edit/${row[0]}`} state={row}>
                  <button
                    type="button"
                    class="btn btn-warning btn-sm"
                  >
                    <FiEdit />
                  </button>
                </Link></td>
              <td ><Link to={`/delete/${row[0]}`} state={row}>
                  <button
                    type="button"
                    class="btn btn-danger btn-sm"
                    
                  >
                    <AiFillDelete />
                  </button>
                </Link></td>
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
  );
};

export default File;
