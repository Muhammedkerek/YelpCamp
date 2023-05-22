const mongoose = require("mongoose");
const passsportLocalMongoose = require("passport-local-mongoose");
const {Schema} = mongoose;

const userSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    }
});
userSchema.plugin(passsportLocalMongoose);
// i pluged in my userSchema to the passportLocalMongoose package
// doing this: i don't need to add a username and a password for my schema .
// and additionally the username and the password added to the schema will be uniqe 
// and the password will be hashed and salted and the numbers of rounds will be written there. 
const User = mongoose.model("User" , userSchema);

module.exports = User;
