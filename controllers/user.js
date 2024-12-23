const express=require("express")
const Listing=require("../models/listing.js")
const User=require("../models/user.js")
const passport=require("passport")


const ExpressError=require("../utils/ExpressError.js")

const { isLoggedIn, saveRedirectUrl } = require("../middleware.js");


module.exports.renderSignupform=(req,res)=>{
    res.render("./user/signup.ejs")
}


module.exports.signup=async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const newUser = new User({ email, username });
        const registeredUser=await User.register(newUser, password);

        req.login(registeredUser,(err)=>{
            if(err){
                return next(err)
            }
            else{
                req.flash("success","registered successfully!")
                res.redirect("/listings");
            }
        })
        
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).send("Server error during registration");
    }
}



module.exports.renderLoginform=(req,res)=>{
    res.render("./user/login.ejs")
}

module.exports.login=async(req,res)=>{
    req.flash("success","logged in successfully")
    if(res.locals.redirectUrl){

        res.redirect(res.locals.redirectUrl)
    }else{
        res.redirect("/listings")
    }
}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err)
        }
        else{
            res.redirect("/listings")
        }
    })
}