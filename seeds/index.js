const mongoose = require("mongoose");
const Campground = require("../models/campground");
const {descriptors , places} = require("./seedHelpers");
const cities = require("./cities");

mongoose.connect('mongodb://127.0.0.1:27017/yelpCamp') // here using the mongoose package , i connected the db with moongose and named the db yelpcamp
.then(function(){
    console.log("Database connected"); // checking the connection process
})
.catch(err=>{
    console.log("Database connection error");
    console.log(err);
})

const sample =function(array){
 const me =   array[Math.floor(Math.random() * array.length)];
return me;
}


const seedDb = async()=>{
    await Campground.deleteMany({});
   for(let i=0;i<300;i++){
    const random1000 = Math.floor(Math.random() * 1000);
    const Price = Math.floor(Math.random()  * 20) +10;
   const camp= new Campground({
        author:"645274e6c2e7cb8ff16ac039",
        location: `${cities[random1000].city}, ${cities[random1000].state}`,
        title: `${sample(descriptors)} ${sample(places)}`,
        description:"i'm hamud the great the creator of the YelpCamp",
        price:Price,
        geometry:{
            type:"Point",
            coordinates: [
                cities[random1000].longitude,
                cities[random1000].latitude,

            ]
        },
        images:[
            {
              url: 'https://res.cloudinary.com/dwe2nlgtp/image/upload/v1683741280/yelpcamp/tfwt7ov4kbwmdu4ds9ia.jpg',
              filename: 'yelpcamp/tfwt7ov4kbwmdu4ds9ia',
            }
          ]
    })
    await camp.save();
   }
}
seedDb().then(()=>{
    mongoose.connection.close();
})