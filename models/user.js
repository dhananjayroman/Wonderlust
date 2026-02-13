const mongoose = require("mongoose");
const PassportLocalMongoose=require("passport-local-mongoose").default;

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    }
})

userSchema.plugin(PassportLocalMongoose)

module.exports = mongoose.model("User",userSchema)