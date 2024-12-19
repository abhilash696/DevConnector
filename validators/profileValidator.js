const validator = require("validator");
const isEmpty = require("./isEmpty")

module.exports = (data) => {
  const errors  = {}

  data.handle = !isEmpty(data.handle) ? data.handle : ""
  data.status = !isEmpty(data.status) ? data.status : ""
  data.skills = !isEmpty(data.skills) ? data.skills : ""

  if(!validator.isLength(data.handle,{min:4, max:20})){
    errors.handle = "handle must be between 4 to 20 characters."
  }

  if(validator.isEmpty(data.handle)){
    errors.handle = "handle cannot be empty"
  }

  if(validator.isEmpty(data.status)){
    errors.status = "status cannot be empty"
  }

  if(validator.isEmpty(data.skills)){
    errors.skills = "skills cannot be empty"
  }

  if(!isEmpty(data.website)){
    if(!validator.isURL(data.website)){
      errors.website = "Not a valid url"
    }
  }

  if(!isEmpty(data.youtube)){
    if(!validator.isURL(data.youtube)){
      errors.youtube = "Not a valid url"
    }
  }

  if(!isEmpty(data.instagram)){
    if(!validator.isURL(data.instagram)){
      errors.instagram = "Not a valid url"
    }
  }

  if(!isEmpty(data.twitter)){
    if(!validator.isURL(data.twitter)){
      errors.twitter = "Not a valid url"
    }
  }

  if(!isEmpty(data.linkedin)){
    if(!validator.isURL(data.linkedin)){
      errors.linkedin = "Not a valid url"
    }
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