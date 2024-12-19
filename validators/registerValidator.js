const validator = require("validator");

module.exports = (data) => {
  const errors = {};

  if (!validator.isLength(data.name, { min: 4, max: 20 })) {
    errors.name = "Name must be between 2 to 20 characters.";
  }

  if (!validator.isEmail(data.email)) {
    errors.email = "Please enter a valid email";
  }

  if (validator.isEmpty(data.email)) {
    errors.email = "Email cannot be empty";
  }

  if (!validator.equals(data.password, data.password2)) {
    errors.password = "Password doesn't match.";
  }

  if (!validator.isLength(data.password, { min: 8 })) {
    errors.password = "Please enter a password greater than 8 characters.";
  }

  let isValid = false;

  if (Object.keys(errors).length === 0) {
    isValid = true;
  }

  return {
    errors,
    isValid,
  };
};
