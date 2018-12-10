const Validator = require("validator");

const isEmpty = require("./is-empty");

module.exports = function validateExperienceInput(data) {
  // data will be a an object
  let errors = {};

  // if the object does not exist give it a blank string
  data.title = !isEmpty(data.title) ? data.title : "";
  data.company = !isEmpty(data.company) ? data.company : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  if (Validator.isEmpty(data.title)) {
    errors.title = "Job title field is required";
  }
  if (Validator.isEmpty(data.company)) {
    errors.company = "Company field is required";
  }
  if (Validator.isEmpty(data.from)) {
    errors.from = "From date field is required";
  }

  // for ES6... errors: errors, -> errors
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
