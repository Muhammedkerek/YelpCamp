const Review = require("../models/review");
const Campground = require("../models/campground");

module.exports.createReview = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success" , "review created!!")
    res.redirect(`/yelpcamp/${campground._id}`);

}

module.exports.deleteReview = async(req,res)=>{
    const {id , reviewId} = req.params;
    await Campground.findByIdAndUpdate(id , {$pull:{reviews:reviewId}}); // here i am pulling it from the reviews array that is inside the Campground model
    await Review.findByIdAndDelete(reviewId); // and here i'm deleting it from the reviews model , i have to do the two steps , the first one is to remove it in the campground , and the second is to delete it on the Review Model
    req.flash("success" , "review deleted!!")
    res.redirect(`/yelpcamp/${id}`);
}