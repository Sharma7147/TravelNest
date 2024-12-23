
const express=require("express")
const router=express.Router({mergeParams:true});
const Listing=require("../models/listing.js")
const Review=require("../models/review.js")
const reviewController=require("../controllers/review.js")

const wrapAsync=require("../utils/wrapAsync.js")
const ExpressError=require("../utils/ExpressError.js")
const { isLoggedIn, saveRedirectUrl,isOwner,isAuthor,validateReview } = require("../middleware.js");


router.post("/", isLoggedIn,validateReview,wrapAsync(reviewController.addReview))


router.delete("/:reviewid",isLoggedIn,isAuthor,wrapAsync(reviewController.destroyReview));


router.all("*",(req,res,next)=>{
    next(new ExpressError("404","page not found"))
})


module.exports=router;