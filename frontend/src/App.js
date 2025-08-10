// 📦 Core Libraries
import React, { useEffect } from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { Container, Spinner, Alert } from "reactstrap";

// 🎯 Auth
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";

// 🧭 Utils
import history from "./utils/history";
import initFontAwesome from "./utils/initFontAwesome";

// 🧱 UI Components
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Loading from "./components/Loading";
import SplashCursor from "./components/SplashCursor";

// 📄 Views / Pages
import Home from "./views/Home";
import Profile from "./views/Profile";
import ExternalApi from "./views/ExternalApi";
import UploadImage from "./components/UploadPage"; // ✅ Protected Upload Page
import MyUploads from "./components/MyUploads";

// 🎨 Styles
import "./App.css";



// ✅ Initialize FontAwesome
initFontAwesome();

const App = () => {
  const {
    isLoading,
    error,
    isAuthenticated,
    getAccessTokenSilently,
  } = useAuth0();

  useEffect(() => {
    const fetchProtected = async () => {
      try {
        const token = await getAccessTokenSilently();
        await fetch("http://localhost:8000/protected", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (err) {
        console.error(err);
      }
    };

    if (isAuthenticated) {
      fetchProtected();
    }
  }, [getAccessTokenSilently, isAuthenticated]);

  if (error) {
    return (
      <Container className="mt-5 text-center">
        <Alert color="danger">
          <h4 className="alert-heading">Oops, something went wrong!</h4>
          <p>{error.message}</p>
        </Alert>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner color="primary" style={{ width: "3rem", height: "3rem" }} />
        <span className="ml-3">Loading App...</span>
      </div>
    );
  }

  return (
    <Router history={history}>
      <div id="app" className="d-flex flex-column min-vh-100">
        <NavBar />
        <main className="flex-grow-1 py-4 text-center">
          <SplashCursor />
          <Container>
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/profile" component={Profile} />
              <Route path="/external-api" component={ExternalApi} />
              <Route path="/my-uploads" component={MyUploads} />
              <Route
                path="/upload"
                component={withAuthenticationRequired(UploadImage, {
                  onRedirecting: () => <Loading />,
                })}
              />
              <Redirect to="/" />
            </Switch>
          </Container>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
