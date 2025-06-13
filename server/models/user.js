import mongoose from "mongoose";

const userSchema = mongoose.Schema({  
    //properties of the user schema
    _id:{type : String , required : true},
    name:{type : String , required : true},
    email:{type : String , required : true},
    image:{type : String , default: ""},
    role:{type : String , enum:["user","hotelOwner"], default: "user"},
    recentSearchCities: [{type : String , required : true}],

},{timestamps: true})

const User = mongoose.model("User" , userSchema); 

export default User;