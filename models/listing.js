const { required } = require("joi");
const mongoose=require("mongoose");
// const review = require("./review");
const Review= require("./review.js")
const User= require("./user.js")


const Schema=mongoose.Schema;

const listingSchema=new Schema({
    title:{
        type:String,
        
    },
    description:String,
    image: {
        url:String,
        filename:String,
      },
    price:{type:Number,
        required:true,},
    location:String,
    country:String,
    review:[{
        type:Schema.Types.ObjectId,
        ref:"Review",
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }

})

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){

        await Review.deleteMany({_id:{$in:listing.review}})
    }
})

const Listing=mongoose.model("Listing",listingSchema)


module.exports=Listing;