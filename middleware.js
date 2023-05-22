const session = require("express-session");
const Campground = require("./models/campground");
const Review = require("./models/review");
const reviewSchema = require("./reviewSchema");
const ExpressError = require("./helpers/ExpressError")
module.exports.isLoggedIn = (req,res,next)=>{
    
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash("error" , "You Must Be Logged In First");
        return res.redirect("/login");
    }
    next();
}


module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}
module.exports.validateCampground = (req,res,next)=>{
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        console.log(error)
        const msg = error.details.map(me=> me.message).join(",");
        throw new ExpressError(msg,404);
    }
    else{
        next();
    }
}

module.exports.isAuthor = async(req,res,next)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash("error" , "You Don't Have The Permmision To This");
        return res.redirect(`/yelpcamp/${id}`);
        // this is for verifying if the request was sent by other tools like postman
    }
    else{
        next();
    }
}
module.exports.isReviewAuthor = async(req,res,next)=>{
    const {id , reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        eq.flash("error" , "You Don't Have The Permmision To This");
        return res.redirect(`/yelpcamp/${id}`);

    }
    next();

}

module.exports.validateReview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        console.log(error)
        const msg = error.details.map(me=> me.message).join(",");
        throw new ExpressError(msg,404);
    }
    else{
        next();
    }
}
 
