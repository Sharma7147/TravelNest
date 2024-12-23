const express=require("express")
const router =express.Router();
const Listing=require("../models/listing.js")
// const Review=require("../models/review.js")
const multer =require("multer")
const {storage}=require("../cloudConfig.js")
const upload=multer({storage})

const listingController=require("../controllers/listings.js")
const wrapAsync=require("../utils/wrapAsync.js")
const ExpressError=require("../utils/ExpressError.js")
const { isLoggedIn, saveRedirectUrl,isOwner ,validateListing} = require("../middleware.js");








router.get("/",wrapAsync(listingController.index))

router.get("/new",isLoggedIn,listingController.renderNewform)

router.post("/", isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.addNewListing))




router.get("/:id",wrapAsync(listingController.showListing))


router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditform))

router.put("/:id", isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateListing))
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))


module.exports=router;

