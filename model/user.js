//importing mongoose
const mongoose = require("mongoose");

//creating schema
const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    //storing the reviews assigned to a user
    assignedReviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Review"

    }]
    //including timestamps
},{timestamps:true});

//exporting model
module.exports=mongoose.model("User",userSchema);