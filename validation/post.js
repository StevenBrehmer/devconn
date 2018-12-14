const Validator = require("validator");

const isEmpty = require("./is-empty");

module.exports = function validatePostInput(data) {
  // data will be a an object
  let errors = {};

  // if the object does not exist give it a blank string
  data.text = !isEmpty(data.text) ? data.text : "";

  if (!Validator.isLength(data.text, { min: 1, max: 300 })) {
    errors.text = "Text field must be between 1 and 300 characters";
  }

  if (Validator.isEmpty(data.text)) {
    errors.text = "Text field is required";
  }

  // for ES6... errors: errors, -> errors
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
