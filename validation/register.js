const Validator = require("validator");

// This is what was given... node threw error on the import
// import isEmpty from "./is-empty";

//This is my attempt to make it work... we will see :x
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
  // data will be a an object
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";

  // we want name on registration to be between 2 and 30 char
  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name must be between 2 and 30 chars";
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }

  // for ES6... errors: errors, -> errors
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
