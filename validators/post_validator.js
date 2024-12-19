const validator = require("validator");
const isEmpty = require("./isEmpty")

module.exports = (data) => {
  const errors  = {}

  data.text = !isEmpty(data.text) ? data.text : ""

  if(!validator.isLength(data.text,{min:4, max:300})){
    errors.text = "post  must be between 4 to 300 characters."
  }

  if(validator.isEmpty(data.text)){
    errors.text = "text cannot be empty"
  }


  let isValid = false

  if(Object.keys(errors).length === 0){
    isValid = true
  }

  return ({
    errors,
    isValid
  })

}