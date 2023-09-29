//importing express
const express=require("express");
const router=express.Router();

// importing passprt
 const passport=require("passport");

//importing home controller
const homeController=require("../controllers/home_controller");

// routing to users
router.use("/users",require("./user"));


// routing to reviews
router.use("/reviews",require("./reviews"));

//for home page
router.get("/",passport.checkAuthentication,homeController.home);

//exporting router
module.exports=router;
