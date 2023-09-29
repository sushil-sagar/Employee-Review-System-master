//importing express
const express=require("express");
const router=express.Router();
// importing passport
const passport=require("passport");

//importing user controller
const userController=require("../controllers/users_controller");

//for login page
router.get("/sign-in",userController.signIn);

//for sign in page
router.get("/sign-up",userController.signUp);

//to create new user
router.post("/create",userController.create);

//to create a session 
//using passport middleware to authenticate
router.post("/create-session",passport.authenticate(
    "local",
    {failureRedirect:"/users/sign-in"}
),userController.createSession);

//for sign out page
router.get("/sign-out",userController.destroySession);

//for user list page
router.get("/list",passport.checkAuthentication,userController.listUsers);

// to get all the users
router.get("/",passport.checkAuthentication, userController.fetchAll);

//to toggle admin
router.get("/update/admin/:id",passport.checkAuthentication, userController.toggleAdmin);

//to update the user
router.post("/update/:id",passport.checkAuthentication, userController.update);

//to delete user
router.get("/destroy/:id",passport.checkAuthentication, userController.destroy);

//exporting router
module.exports=router;