// used to authnticate user without login some permission not granted middleware
const Listing=require("./models/listing.js")
const Review=require("./models/review.js")
const {reviewSchema}=require("./schema.js")
const {listingSchema}=require("./schema.js")



const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        console.log(req.session.redirectUrl);
        req.flash("error", "You must be logged in first");
        return res.redirect("/user/login");
    }
    next();
};

//  this store a path at which we request for loggedin
const saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};


const isOwner = async(req, res, next) => {
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error",("you are not owner of listing"))
        return res.redirect(`/listings/${id}`)
    }

    next();
};

const isAuthor = async(req, res, next) => {
    let {id,reviewid}=req.params;
    let review=await Review.findById(reviewid);
    if( !res.locals.currUser ||!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error",("you are not Author of Review"))
        return res.redirect(`/listings/${id}`)
    }

    next();
};

const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        
        throw new ExpressError(400,error.message);
    } else {
        next();
    }
};


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const message = error.details.map(err => err.message).join(', ');
        throw new ExpressError(400, message);
    } else {
        next();
    }
};

module.exports = {
    isLoggedIn,
    saveRedirectUrl,
    isOwner,
    isAuthor,
    validateListing,
    validateReview
};
