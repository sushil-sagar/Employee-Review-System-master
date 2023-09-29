//custom middleware to setup flash messages
module.exports.setFlash = (req, res, next) => {
    res.locals.flash = {
        loginSuccess: req.flash("login_success"),
        logoutSuccess: req.flash("logout_success"),
        success: req.flash("success"),
        "error": req.flash("error")
    };
    //redirecting ti next middleware
    next();
}