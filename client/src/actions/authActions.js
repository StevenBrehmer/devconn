import { GET_ERRORS } from "./types";
import axios from "axios";

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
