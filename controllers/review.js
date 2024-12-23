const express=require("express")
const router=express.Router({mergeParams:true});
const Listing=require("../models/listing.js")
const Review=require("../models/review.js")

const wrapAsync=require("../utils/wrapAsync.js")
const ExpressError=require("../utils/ExpressError.js")
const {reviewSchema}=require("../schema.js")
const { isLoggedIn, saveRedirectUrl,isOwner,isAuthor } = require("../middleware.js");



module,exports.addReview=async(req,res,next)=>{
    let id= req.params.id;
    let listing= await Listing.findById(id);
    let newreview=new Review(req.body.review);
    newreview.author=req.user._id;

    listing.review.push(newreview);

    await newreview.save();
    await listing.save();

    console.log(newreview)
    req.flash("success","review submitted!")


    res.redirect(`/listings/${id}`)


}


module.exports.destroyReview=async(req,res,next)=>{
    let {id,reviewid}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{review:reviewid}});
    await Review.findByIdAndDelete(reviewid)
    req.flash("success","review deleted!")
 
 res.redirect(`/listings/${id}`)
 
 }