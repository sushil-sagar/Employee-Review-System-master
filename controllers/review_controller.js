//importing review model
const Review = require("../model/review");
//importing user model
const User = require("../model/user");

//to create a review, 
module.exports.create = async (req, res) => {
    try {
        //if it is a AJAX request,
        // making sure that the request is made by admin
        if (req.xhr && req.user.isAdmin) {
            const review = await Review.create(req.body);
            // if review is created successfully
            if (review) {
                const user = await User.findById(req.body.reviewer);
                user.assignedReviews.push(review);
                await user.save();
                await review.populate({
                    path: "reviewer reviewee",
                    select: "name"
                });
                return res.status(200).json({
                    data: review,
                    message: "Review created successfully"
                });
            }
            return res.status(400).json({ message: "Unable to create review" });
        }
        return res.status(401).json({ message: "Unauthorized" });


    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });

    }

}

//to fetch all the reviews
module.exports.fetchAll = async (req, res) => {
    try {
        //making sure request is AJAX, and made by admin
        if (req.xhr && req.user.isAdmin) {
            const reviews = await Review.find().populate({
                path: "reviewer reviewee",
                select: "name"
            });
            // if found
            if (reviews) {
                return res.status(200).json({
                    data: reviews,
                    message: "reviews fetched successfully"
                });
            }
            // if not
            return res.status(400).json({ message: "Unable to fetch reviews" });

        }
        // if the request is not made by admin
        return res.status(401).json({ message: "Unauthorized" });

    } catch {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

//controller action to delete a review
module.exports.destroy = async (req, res) => {
    try {
        if (req.xhr && req.user.isAdmin) {
            const review = await Review.findById(req.params.id);
            // if found,
            // and to make sure that only pending reviews can be deleted
            if (review && !review.isSubmitted) {
                let deletedReview = await Review.findByIdAndDelete(req.params.id);
                return res.status(200).json({
                    id: deletedReview._id,
                    message: "Review deleted successfully"
                });
            }
        }
        //is the request is submitted
        return res.status(401).json({ message: "Unauthorized" });
        //if something goes wrong
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });

    }
}

//to update a review
module.exports.update = async (req, res) => {
    try {
        const updated = await Review.findByIdAndUpdate(req.params.id, req.body,{new:true});
        if (updated) {
            if(req.user.isAdmin) req.flash('success',"Review updated successfully");
            else req.flash('success',"Review submitted successfully");
            return res.redirect("back");
        }
        //if not updated
        req.flash('error',"Unable to update, try again");
        return res.redirect("back");
        
        
        
        // if something else goes wrong
    } catch (error) {
        req.flash('error',"Unable to update, try again");
        return res.redirect("back");

    }
}