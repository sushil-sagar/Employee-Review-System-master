//importing express
const express = require('express');

// setting port
const port =process.env.PORT||3200;
const app = express();


//importing database
const db = require("./config/mongoose");

//importing passport and local strategy along with session
const session=require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport_local");

//importing cookie parser
const cookieParser = require("cookie-parser");

//importing connect mongo session
const MongoDBStore = require('connect-mongodb-session')(session);

//importing connect flash for flash messages
const flash = require("connect-flash");
const flashMiddleware = require("./config/flash_middleware");

//declaring mongo uri
const mongoUri=process.env.MONGO_URI || "mongodb://127.0.0.1:/ers_database"


//using decoder for post requests
app.use(express.urlencoded({extended:true}));

//declaring static file path
app.use(express.static("./assets"));

//using cookie parser
app.use(cookieParser());

// setting express layouts
const expressLayouts=require("express-ejs-layouts")
app.use(expressLayouts);
//to extract static files into layout
app.set("layout extractStyles",true);
app.set("layout extractScripts",true);

//setting view engine
app.set("view engine","ejs");
//declaring views path 
app.set("views","./views");




//setting up mongo store
const store = new MongoDBStore({
  uri: mongoUri,
  collection: 'sessions'
});
store.on('error', function (error) {
  console.error('Session store error:', error);
});



//using sessions
app.use(session({
    name:"employeeReviewSystem",
    secret:"#&49@5A2Qn6s7g0^a*3E9k1dA%2^8VA6%9AZ^C77",
    saveUninitialized:false,
    resave:false,
    cookie:{
        secure:false,
        maxAge:6000000
    },
    store:store
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

//setting up flash
app.use(flash());
app.use(flashMiddleware.setFlash);


//routing requests to routes
app.use("/",require("./routes/index.js"));


//starting the server   
app.listen(port,(error)=>{
    if(error){
         console.log(`Error starting the server: ${error}`); 
         return;}
    console.log(`server running on port: ${port}`);
});
