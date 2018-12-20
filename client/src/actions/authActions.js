import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import { GET_ERRORS, SET_CURRENT_USER } from "./types";
// Register User
export const registerUser = (userData, history) => dispatch => {
  // This should be inside an asyc call.
  // thus we nee dto use thunk
  axios
    .post("/api/users/register", userData)
    .then(res => history.push("/login"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Register User - get user token
export const loginUser = userData => dispatch => {
  axios
    .post("/api/users/login", userData)
    .then(res => {
      // Save to Local Storage
      const { token } = res.data;
      //set token to local storage
      localStorage.setItem("jwtToken", token);
      // Now set to AuthHeader
      setAuthToken();
      //decode token to get user data
      const decoded = jwt_decode(token);
      // sets current user
      dispatch(setCurrentUser(decoded));

      console.log(decoded);
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};
