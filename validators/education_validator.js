const validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = (data) => {
  const errors = {};

  data.school = !isEmpty(data.school) ? data.school : "";
  data.degree = !isEmpty(data.degree) ? data.degree : "";
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : "";
  data.description = !isEmpty(data.description) ? data.description : "";
  data.from = !isEmpty(data.from) ? data.from : "";
  data.to = !isEmpty(data.to) ? data.to : "";

  if (validator.isEmpty(data.school)) {
    errors.school = "school cannot be empty";
  }

  if (validator.isEmpty(data.degree)) {
    errors.degree = "degree cannot be empty";
  }

  if (validator.isEmpty(data.from)) {
    errors.date = "date cannot be empty";
  }

  if (data.to && data.from > data.to) {
    errors.todate = "please check date";
  }

  if (validator.isEmpty(data.fieldofstudy)) {
    errors.fieldofstudy = "fieldOfStudy cannot be empty";
  }

  if (validator.isEmpty(data.description)) {
    errors.description = "description cannot be empty";
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
