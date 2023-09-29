//importing passport
const passport = require("passport");
//importing strategy
const LocalStrategy = require("passport-local").Strategy;

//importing user model
const User = require("../model/user");

// authentication
passport.use(new LocalStrategy({
    usernameField: "email",
    passReqToCallback: true
},
    async (req, email, password, done) => {
        const user = await User.findOne({ email: email })
        if (user) {
            if (user.password != password) {
                //to notify the user
                req.flash("error", "Incorrect Username/Password");
                return done(null, false);
            }
            return done(null, user);
        } else {
            //to notify the user
            req.flash("error", "Incorrect Username/Password");
            return done();
        }
    }
));

//to serialize the user
passport.serializeUser((user, done) => {
    //sending the id as cookie
    done(null, user.id);
});

//to deserialize the user
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        if (!user) {
            return done(null, false)
        }
        return done(null, user);

    } catch (error) {
        return done(error);

    }

});

passport.checkAuthentication = (req, res, next) => {
    //if user is authenticated, passing req to controller action
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect("/users/sign-in");
}

//creating a method in passport to set the authenticated user
passport.setAuthenticatedUser = (req, res, next) => {
    if (req.isAuthenticated()) {
        //passing user details to locals
        res.locals.user = req.user;
    }

    //passing request to next middleware
    next();
}

//exporting passport
module.exports = passport;