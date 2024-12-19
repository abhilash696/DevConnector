const validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = (data) => {
  const errors = {};

  data.title = !isEmpty(data.title) ? data.title : "";
  data.company = !isEmpty(data.company) ? data.company : "";
  data.description = !isEmpty(data.description) ? data.description : "";

  if (validator.isEmpty(data.title)) {
    errors.title = "title cannot be empty";
  }

  if (validator.isEmpty(data.company)) {
    errors.company = "company cannot be empty";
  }

  if (validator.isEmpty(data.description)) {
    errors.description = "description cannot be empty";
  }

  if (validator.isEmpty(data.from)) {
    errors.date = "date cannot be empty";
  }

  if (data.to && data.from > data.to) {
    errors.todate = "please check date";
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
