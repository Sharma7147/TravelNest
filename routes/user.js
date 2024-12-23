const express=require("express")
const router=express.Router({mergeParams:true});
const Listing=require("../models/listing.js")
const passport=require("passport")
const userController=require("../controllers/user.js")

const wrapAsync=require("../utils/wrapAsync.js")
const ExpressError=require("../utils/ExpressError.js")

// const saveRedirectUrl=require()
const { isLoggedIn, saveRedirectUrl } = require("../middleware.js");




router.get("/signup",userController.renderSignupform)

router.post("/signup", wrapAsync(userController.signup));

router.get("/login",userController.renderLoginform)


router.post("/login",saveRedirectUrl,
    passport.authenticate("local",
        {failureRedirect:"/user/login",
            failureFlash:true}),
            userController.login)



router.get("/logout",userController.logout)


module.exports=router;