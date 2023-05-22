const Campground = require("../models/campground");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({accessToken: mapBoxToken});
const {cloudinary} = require("../cloudinary");


module.exports.index = async (req, res) => {
    const campGrounds = await Campground.find({});
    res.render("campgrounds/index.ejs", { campGrounds });
}

module.exports.renderNewForm = (req,res)=>{
    res.render("campgrounds/make.ejs")
}

module.exports.createCampground = async (req, res) => {
    const geoData = await geoCoder.forwardGeocode({query:req.body.location,limit:1}).send();
    const campground = new Campground(req.body);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({url:f.path , filename:f.filename}));
    campground.author = req.user._id;
    await campground.save();
    console.log(campground)
    req.flash("success" , "successfully made a campground")
   return res.redirect(`/yelpcamp/${campground._id}`);


}
module.exports.showCampground = async (req, res) => {

    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path:"reviews",populate:{
            path:"author"
        }}).populate("author");
    
    if(!campground){
        req.flash("error" , "can't find campground!")
        res.redirect("/yelpcamp");
    }
    res.render("campgrounds/show.ejs", { campground });

}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const match = await Campground.findById(id);
    if(!match){
        req.flash("error" , "can't find campground!")
        res.redirect("/yelpcamp");
    }
    res.render("campgrounds/edit", { match });
}


module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const camp = await Campground.findByIdAndUpdate(id, req.body);
    const imgs = req.files.map(f => ({url:f.path , filename:f.filename}));
    camp.images.push(...imgs);
   if(req.body.deleteImages){
    for(let filename of req.body.deleteImages){
       await cloudinary.uploader.destroy(filename);
    }
    await camp.updateOne({$pull: {images: {filename: {$in:req.body.deleteImages} } } } )
    console.log(camp);
   }
    await camp.save()
    req.flash("success" , "campground updated successfully")
    res.redirect(`/yelpcamp/${camp._id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success" , "campground deleted successfully")
    res.redirect("/yelpcamp");
}