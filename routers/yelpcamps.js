const express = require("express");
const router = express.Router();
const catchAsync = require("../helpers/catchAsync");
const campgrounds = require("../controllers/campgrounds")
const {isLoggedIn , isAuthor} = require("../middleware");
const multer = require("multer");
const {storage} = require("../cloudinary")
const upload = multer({storage});



router.get("/", catchAsync(campgrounds.index));



router.post("/", isLoggedIn , upload.array("image") , catchAsync(campgrounds.createCampground));

router.get("/make" , isLoggedIn, campgrounds.renderNewForm );

router.get("/:id",  catchAsync(campgrounds.showCampground));

router.get("/:id/edit",  isLoggedIn  , isAuthor,  catchAsync(campgrounds.renderEditForm));

router.put("/:id", isLoggedIn , isAuthor ,upload.array("image")  ,  catchAsync(campgrounds.updateCampground));

router.delete("/:id", isLoggedIn , isAuthor,  catchAsync(campgrounds.deleteCampground));
module.exports = router;