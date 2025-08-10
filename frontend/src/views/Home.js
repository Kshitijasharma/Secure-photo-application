import React from "react";
import { Button } from "reactstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { useHistory } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const { loginWithRedirect, isAuthenticated, logout, user } = useAuth0();
  const history = useHistory();

  return (
    <div className="hero-container">
      <div className="overlay" />
      <div className="content">
        <h1>🔐 Secure Image Upload</h1>
        <p>Upload and store your images securely with full protection.</p>

        {!isAuthenticated ? (
          <Button color="primary" size="lg" onClick={() => loginWithRedirect()}>
            Log In to Continue
          </Button>
        ) : (
          <>
            <p className="welcome-text">
              Welcome, <strong>{user?.name || "User"}</strong>!
            </p>
            <div className="d-flex justify-content-center mt-3 gap-3">
              <Button
                color="success"
                size="lg"
                onClick={() => history.push("/upload")}
              >
                Go to Upload
              </Button>
              <Button
                color="info"
                size="lg"
                onClick={() => history.push("/my-uploads")}
              >
                My Uploads
              </Button>
              <Button
                color="danger"
                size="lg"
                onClick={() => logout({ returnTo: window.location.origin })}
              >
                Log Out
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
