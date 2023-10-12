import React, { useEffect, useState } from "react";
import axios from "axios";
import './filemanager.scss';
import constants from "../../util/constants";

function Filemanager() {
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);
  const [fileDesc, setFileDesc] = useState("");
 

  useEffect(() => {
    axios.post(constants.BASE_URL+"/filemanager",localStorage.getItem('email')).then((response) => {
      console.log(response.data.data)
      setData(response.data.data)
    });
  }, []);

  const deleteRow = (file_name) => {
    axios.delete(constants.BASE_URL+`/deletefileS3/${localStorage.getItem('email')}/${file_name}`).then(() => {
      setData(data.filter((item) => item.file_name !== file_name));
    });
  };

  const handleFileChange = (e) => {
    if(e.target.files[0].size > 10485760) { // 10 MB in bytes
      alert("File size should be less than or equal to 10 MB");
      setFile(null);
    } else {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if(file && fileDesc) {
      let formData = new FormData();
      formData.append('file', file);
      formData.append('description', fileDesc);
      formData.append('email', localStorage.getItem('email'));
      axios.post(constants.BASE_URL+"/upload", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((response) => {
        console.log(response);
      });
    } else {
      alert("Please select a file and enter a description");
    }
  }

  return (
    <div>
      <h1>FILE MANAGEMENT</h1>
      <input type="text" value={fileDesc} onChange={(e) => setFileDesc(e.target.value)} placeholder="Enter file description" />
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>UPLOAD FILE TO CLOUD</button>
      <h3>LIST OF FILES IN CLOUD</h3>
    <table>
      <thead>
        <tr>
          <th>File Name</th>
          <th>File Desc</th>
          <th>Status</th>
          <th>Download</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row,index) => (
          <tr key={index}>
            <td>{row[1]}</td>
            <td>{row[2]}</td>
            <td>{row[5]}</td>
            <td>{row[3]}</td>
            <td>
            <button onClick={() => deleteRow(row[1])}>Download</button>
            <button onClick={() => deleteRow(row[1])}>Modify</button>
              <button onClick={() => deleteRow(row[1])}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table></div>
  );
}

export default Filemanager;
