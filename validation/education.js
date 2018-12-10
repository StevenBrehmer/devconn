const Validator = require("validator");

const isEmpty = require("./is-empty");

module.exports = function validateEducationInput(data) {
  // data will be a an object
  let errors = {};

  // if the object does not exist give it a blank string
  data.school = !isEmpty(data.school) ? data.school : "";
  data.degree = !isEmpty(data.degree) ? data.degree : "";
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : "";
  data.location = !isEmpty(data.location) ? data.location : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  if (Validator.isEmpty(data.school)) {
    errors.school = "School field is required";
  }
  if (Validator.isEmpty(data.degree)) {
    errors.degree = "degree field is required";
  }
  if (Validator.isEmpty(data.fieldofstudy)) {
    errors.fieldofstudy = "fieldofstudy field is required";
  }
  if (Validator.isEmpty(data.location)) {
    errors.location = "location field is required";
  }
  if (Validator.isEmpty(data.from)) {
    errors.from = "from date field is required";
  }

  // for ES6... errors: errors, -> errors
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
