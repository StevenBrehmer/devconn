const Validator = require("validator");

const isEmpty = require("./is-empty");

module.exports = function validateProfileInput(data) {
  // data will be a an object
  let errors = {};

  // if the object does not exist give it a blank string
  data.handle = !isEmpty(data.hanlde) ? data.hanlde : "";
  data.status = !isEmpty(data.status) ? data.status : "";
  data.skills = !isEmpty(data.skills) ? data.skills : "";

  if (!Validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = "Handle needs to be 2 and 40 characters.";
  }
  if (!Validator.isEmpty(data.handle)) {
    errors.handle = "Profile handle is required";
  }
  if (!Validator.isEmpty(data.status)) {
    errors.status = "Status is required";
  }
  if (!Validator.isEmpty(data.skills)) {
    errors.skills = "Skills is required";
  }

  if (!isEmpty(data.website)) {
    if (!Validator.isURL(data.website)) {
      errors.website = "Not a valid URL";
    }
  }

  if (!isEmpty(data.youtube)) {
    if (!Validator.isURL(data.youtube)) {
      errors.youtube = "Not a valid URL";
    }
  }
  if (!isEmpty(data.twitter)) {
    if (!Validator.isURL(data.twitter)) {
      errors.twitter = "Not a valid URL";
    }
  }
  if (!isEmpty(data.facebook)) {
    if (!Validator.isURL(data.facebook)) {
      errors.facebook = "Not a valid URL";
    }
  }
  if (!isEmpty(data.linhedin)) {
    if (!Validator.isURL(data.linhedin)) {
      errors.linhedin = "Website Not a valid URL";
    }
  }
  if (!isEmpty(data.website)) {
    if (!Validator.isURL(data.website)) {
      errors.website = "Website Not a valid URL";
    }
  }
  /*if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }*/

  // for ES6... errors: errors, -> errors
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
