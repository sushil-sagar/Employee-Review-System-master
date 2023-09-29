// const passport=require("passport");

// importing user schema
const User = require("../model/user");
const Review = require("../model/review");


//controller to load the homepage
module.exports.home = async (req, res) => {
    if (req.user.isAdmin) {
        const users = await User.find();

        return res.render('home_admin', {
            title: 'Home',
            users: users
        });
    }
    // if the request is not made by the admin
    try {
        const reviews = await Review.find({
            reviewer: req.user.id,
            isSubmitted: false
        }).populate({
            path: "reviewee",
            select: "name"
        }).sort({ createdAt: -1 });


        return res.render('home_employee', {
            title: 'Home',
            reviews: reviews

        });

    } catch (error) {
        req.logout((error) => {
        });
        return res.redirect("/");
    }
}