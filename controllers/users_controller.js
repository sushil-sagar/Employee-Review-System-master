// importing user model
const User = require("../model/user");

// importing review model
const Review = require("../model/review");
//importing validator
const validator = require("validator");


//to create a new user
module.exports.create = async (req, res) => {
    try {
        //for AJAX requests
        if (req.xhr) {
            // to check the request is made by admin or not
            if (!req.user.isAdmin) {
                return res.status(401).json({
                    message: "Unauthorized request",
                });
            }
            if (req.body.password !== req.body.confirm_password) return res.status(403).json({ message: "Password does not match" });
            //using validator for email verification
            if (!validator.isEmail(req.body.email)) return res.status(403).json({ message: "Provide a valid email" });

            const user = await User.findOne({ email: req.body.email });
            //if user already exists
            if (user) return res.status(403).json({ message: "User already exists" });
            //creating new user
            const newUser = await User.create(req.body);
            if (newUser) {

                return res.status(200).json({
                    data: newUser,
                    message: "User created successfully"
                });
            } else return res.status(500).json({ message: "Unable to create user" });
        }

        //if it is a normal request
        if (req.body.password !== req.body.confirm_password) {
            //to notify the user
            req.flash("error", "Password Mismatch");
            return res.redirect("back");
        }
        //using validator for email verification
        if (!validator.isEmail(req.body.email)) {
            //to notify the user
            req.flash("error", "Provide a valid email address");
            return res.redirect("back");
        }
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            //to notify the user
            req.flash("error", "User already exists");
            return res.redirect("back");
        }
        const newUser = await User.create(req.body);
        req.flash("success", "Registered successfully");
        return res.redirect("/users/sign-in");


    } catch (error) {
        //to notify the user
        req.flash("error", "Error while signing up, please try again");
        return res.redirect("back");
    }



}

//to login the user
module.exports.createSession = async (req, res) => {
    //to send the flash message
    req.flash('login_success', "Logged in successfully ");
    return res.redirect("/");

}

//to go to the sign in page
module.exports.signIn = (req, res) => {
    //if user already logged in
    if (req.isAuthenticated()) return res.redirect("/");
    // if not
    return res.render("user_sign_in");
}


//to go to the sign up page
module.exports.signUp = (req, res) => {
    //if user already logged in
    if (req.isAuthenticated()) return res.redirect("/");
    // if not
    return res.render("user_sign_up");
}

//to logout the user
module.exports.destroySession = (req, res) => {
    //to logout
    req.logout((error) => {
    });
    //to send the flash message
    req.flash('logout_success', "Logged Out successfully ");

    return res.redirect("/users/sign-in");
}

//to user list page
module.exports.listUsers = (req, res) => {
    if (req.user.isAdmin) return res.render("user_list");
    return res.redirect("/");
}

//to fetch all the users
module.exports.fetchAll = async (req, res) => {
    try {
        const users = await User.find();
        //making sure the request is AJAX
        if (req.xhr) {
            // if users found
            if (users) {
                return res.status(200).json({
                    data: users,
                    message: "users fetched successfully"
                });
                // if not
            } else return res.status(500).json({ message: "unable to fetch users"});
        }
        // if not AJAX, redirecting back
        return res.redirect("back");
        // if something goes wrong
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error"
        });
        return res.redirect("back");

    }
}

//to toggle the admin
module.exports.toggleAdmin = async (req, res) => {
    try {
        //putting another check to make sure only admin can make another employee admin
        if (req.xhr && req.user.isAdmin) {
            const user = await User.findById(req.params.id);
            if (user) {
                user.isAdmin = !user.isAdmin;
                await user.save();
                return res.status(200).json({
                    isAdmin: user.isAdmin,
                    message: "User updated successfully"
                });
            }
            //if the user is not found
            res.status(500).json({
                message: "User not found"
            });
        }

        //if something else goes wrong
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error"
        });

    }

}

//to update the user
module.exports.update = async (req, res) => {
    try {
        //to make sure the request is AJAX
        if (req.xhr) {
            //using validator for email verification
            if (!validator.isEmail(req.body.email)) {
                return res.status(403).json({ message: "Provide a valid Email" });
            }
            // if the password and the confirm password does not Match
            if (req.body.password !== req.body.confirm_password) {
                return res.status(403).json({ message: "Password does not match" });
            }
            const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
            //if user is updated successfully
            if (updatedUser) {
                return res.status(200).json({
                    data: updatedUser,
                    message: "Credentials updated successfully"
                });
            }
            // if not
            return res.status(400).json({
                message: "Unable to update credentials"
            });

        }
        //if something else goes wrong
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error"
        });

    }
}

//to delete the user
module.exports.destroy = async (req, res) => {
    try {
        //if the request is AJAX
        if (req.xhr) {
            //deleting the reviews associated with the user
            await Review.deleteMany({
                reviewee: req.params.id
            });

            await Review.deleteMany({
                reviewer: req.params.id
            });
            const deletedUser = await User.findByIdAndDelete(req.params.id);
            // if deleted successfully
            if (deletedUser) {
                return res.status(200).json({
                    id: deletedUser.id,
                    message: "User deleted successfully"
                });
                // if not
            } else {
                res.status(500).json({
                    message: "Unable to delete user"
                });
            }
        }

        //if something else goes wrong
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error"
        });

    }
}
