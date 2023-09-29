// importing mongoose
const mongoose=require("mongoose");

//creating schema
const reviewSchema=new mongoose.Schema({
    reviewer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    reviewee:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    feedback:{
        type:String,
    },
    //to keep track that review is submitted or not
    isSubmitted:{
        type:Boolean,
        default:false
    }
    //to maintain timestamps
},{timestamps:true});

//creating model from schema and exporting it
module.exports=mongoose.model("Review",reviewSchema);