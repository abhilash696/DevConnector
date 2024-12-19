const validator = require("validator");

module.exports = (data) => {
  const errors = {};

  if (!validator.isEmail(data.email)) {
    errors.email = "Please enter a valid email";
  }

  if (validator.isEmpty(data.email)) {
    errors.email = "Email cannot be empty";
  }

  if (!validator.isLength(data.password, { min: 8 })) {
    errors.password = "Please enter a password greater than 8 characters.";
  }

  let isValid = false;

  if (Object.keys(errors).length === 0) {
    isValid = true;
  }

  console.log(errors, isValid);

  return {
    errors,
    isValid,
  };
};
