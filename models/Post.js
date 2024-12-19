const mongoose =  require("mongoose")

const postSchema =  mongoose.Schema({
  text : {
    type:String,
    required: true
  },

  user : {
    type : mongoose.Schema.Types.ObjectId,
    refs : "users"
  },

  name : {
    type:String
  },

  avatar : {
    type : String
  },

  likes :  [{
    user : {
      type : mongoose.Schema.Types.ObjectId,
      refs : "users"
    }
  }],

  comments : [{

    user : {
      type : mongoose.Schema.Types.ObjectId,
      refs : "users"
    },

    text : {
      type: String,
      required : true
    },

    comment_date : {
      type : Date,
      default : Date.now()
    },

    name : {
      type:String
    },
  
    avatar : {
      type : String
    },

  }],

  createdAt : {
    type : Date,
    default : Date.now()
  },
})

const Post = new mongoose.model("post",postSchema)

module.exports = Post