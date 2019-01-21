import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { logoutUser } from "./actions/authActions";
import { setCurrentUser } from "./actions/authActions";
import { Provider } from "react-redux";
import store from "./store";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import "./App.css";

// Check for Token
if (localStorage.jwtToken) {
  // Set auth token header Auth
  setAuthToken(localStorage.jwtToken);
  // Decode Tokena nd get user info and expiration
  const decoded = jwt_decode(localStorage.jwtToken);
  // call the set current user action
  // and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  //Check for Expire token!
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    //  Log out user
    store.dispatch(logoutUser());
    // Clear current profile
    // TODO:
    // redirect to login page
    window.location.href = "/login";
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path="/" component={Landing} />
            <div className="container">
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
            </div>

            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
