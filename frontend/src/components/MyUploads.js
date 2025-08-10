import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import "./MyUploads.css";
const MyUploads = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [uploads, setUploads] = useState([]);

  useEffect(() => {
    const fetchUploads = async () => {
      try {
        const token = await getAccessTokenSilently();
        const res = await axios.get("http://localhost:8000/my-uploads", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUploads(res.data);
      } catch (err) {
        console.error("Error fetching uploads", err);
      }
    };
    fetchUploads();
  }, [getAccessTokenSilently]);

  return (
    <div className="container mt-4">
      <h2>📂 My Uploaded Files</h2>
      {uploads.length === 0 ? (
        <p>No uploads yet.</p>
      ) : (
        <div className="row">
          {uploads.map((upload, idx) => (
            <div className="col-md-4" key={idx}>
              <div className="card mb-3">
                <img
                  src={upload.file_url}
                  className="card-img-top"
                  alt={upload.filename}
                />
                <div className="card-body">
                  <h5 className="card-title">{upload.filename}</h5>
                  <p className="card-text">
                    Uploaded on: {new Date(upload.upload_time).toLocaleString()}
                  </p>
                  <a
                    href={upload.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    View File
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyUploads;
