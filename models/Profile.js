const mongoose =  require("mongoose")

const profileSchema = mongoose.Schema({
  user:{
    type : mongoose.Schema.Types.ObjectId,
    ref : "users"
  },

  handle:{
    type : String,
    required : true
  },

  company:{
    type: String,
  },

  website:{
    type:String,
  },

  location:{
    type: String
  },

  bio : {
    type:String
  },

  status : {
    type: String,
    required : true
  },

  githubusername : {
    type:String
  },

  skills : {
    type : [String],
    required : true
  },

  experience : [{
      company : {
        type: String,
        required: true
      },
      title: {
        type:String,
        required : true
      },
      from:{
        type: Date,
        required : true
      },
      to:{
        type:Date
      },
      current:{
        type: Boolean,
        default : false
      },
      location:{
        type:String
      },
      description:{
        type:String,
        required:true
      }

    }],

  education : [{

      school : {
        type: String,
        required: true
      },
      degree: {
        type:String,
        required : true
      },
      from:{
        type: Date,
        required : true
      },
      to:{
        type:Date
      },
      current:{
        type: Boolean,
        default : false
      },
      fieldOfStudy:{
        type:String,
        required: true
      },
      description:{
        type:String,
        required:true
      }

    }],

  socials : {
    twitter : String,
    instagram : String,
    youtube : String,
    linkedin : String
  },

  createdAt : {
    type:Date,
    default : Date.now()
  }

})

const Profile = mongoose.model("profile",profileSchema);

module.exports = Profile