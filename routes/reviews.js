//importing express
const express=require("express");
const router=express.Router();


//importing reviews controller
const reviewsController=require("../controllers/review_controller");

//to create a new review
router.post("/create",reviewsController.create);


//to fetch all reviews
router.get("/",reviewsController.fetchAll);


//to delete a review
router.get("/destroy/:id",reviewsController.destroy);


//to update a review
router.post("/update/:id",reviewsController.update);

module.exports =router;