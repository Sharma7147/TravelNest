const express=require("express")
const Listing=require("../models/listing.js")
const ExpressError=require("../utils/ExpressError.js")



module.exports.index=async(req,res,next)=>{
    const allListings= await Listing.find({});
    res.render("listings/index.ejs",{allListings})
}

module.exports.renderNewform=(req,res)=>{
    res.render("listings/new.ejs")
}

module.exports.addNewListing=async(req,res,next)=>{
    let  url=req.file.path;
    let filename=req.file.filename;
    
    const newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename}
    await newListing.save();
    req.flash("success","new listing added!")
   res.redirect("/listings")

}

module.exports.showListing=async (req,res,next)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"review",populate:{path:"author"},} ).populate("owner")
    if(!listing){
    req.flash("error","listing not found!")
    res.redirect("/listings")

    }
    else

    res.render("listings/show.ejs",{listing})
}

module.exports.renderEditform=async(req,res,next)=>{
    let {id}=req.params;

    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","listing not found!")
    res.redirect("/listings")

    
        }
        else
    res.render("listings/edit.ejs",{listing})
}


module.exports.updateListing=async (req,res,next)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"send valid data")
    }
    let {id}=req.params;
    
    let newListing=await Listing.findByIdAndUpdate(id,{...req.body.listing})
if(typeof req.file!=="undefined"){
    let  url=req.file.path;
    let filename=req.file.filename;

    newListing.image={url,filename}
    await newListing.save()
}

    req.flash("success","listing updated!")

    res.redirect(`/listings/${id}`)  
}


module.exports.destroyListing=async(req,res,next)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","listing deleted!")

    res.redirect("/listings")

}



