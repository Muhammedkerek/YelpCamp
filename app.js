if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const flash = require("connect-flash");
const method = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./helpers/ExpressError");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const userRouter = require("./routers/users");
const yelpcampsRouter = require("./routers/yelpcamps");
const reviewsRouter = require("./routers/reviews");
const mongoInjection = require("express-mongo-sanitize");
const helmet = require("helmet");
const session = require("express-session");
const MongoStore = require("connect-mongo");
//process.env.DB_URL : for cloud mongodb db
// 

mongoose.connect("mongodb://127.0.0.1:27017/yelpCamp") // here using the mongoose package , i connected the db with moongose and named the db yelpcamp
    .then(function () {
        console.log("Database connected"); // checking the connection process
    })
    .catch(err => {
        console.log("Database connection error");
        console.log(err);
    })

const app = express();
app.use(express.urlencoded({ extended: true })); // to make sure i have the req.body when i send the post req
app.use(method("_method")); //because there is no put or patch request in the html form

const dbs = "mongodb://127.0.0.1:27017/yelpCamp";
const store = new MongoStore({

    mongoUrl: dbs,
    secret: "mysecret",
    touchAfter: 24 * 60 * 60,

});




const sessionConfig = {
    store,
    name: "session",
    secret: "mysecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7

    }

}
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet({ contentSecurityPolicy: false }));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

// passport.serializeUser method , is used to store a user in the session .
// passport.deserializeUser method , is used to destroy a user from the session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user; // it holds the authenicated user's information
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.use("/", userRouter);
app.use("/yelpcamp", yelpcampsRouter);
app.use("/yelpcamp/:id/reviews", reviewsRouter);
app.use(express.static(path.join(__dirname, "public")));
app.use(mongoInjection({ replaceWith: '_' }));

app.get("/", (req, res) => {
    res.render("home");
})

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));





// i use this so if that i pass any path that doesn't exist the response shall be like below
app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 405))
})

// Basic Error Handler
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "something went wrong"
    res.status(statusCode).render("error.ejs", { err });
})


app.listen(4000, () => {
    console.log("the server is running on the 4000 port");
})


// i do the populate to show something that i already submited
// because in the database it's stored as an object id
// and when i do populate it will show on my node shell the information needed.
// and to show the information on my show page after i submit a review  , it has to be populated.

// i use the Joi schema validator to check on the things that are not on the client side
// i already made the client side valdiating but what if someone sent a request through postman or diffrent
// https server sender.(that name is not valid i just made it so there is nothing called server sender).

