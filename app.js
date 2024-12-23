if(process.env.NODE_ENV !="production"){
    require("dotenv").config();

}
console.log(process.env.SECRET)


const express = require("express")
const app = express()
const port = 3000
const path = require("path")
const ejsmate = require("ejs-mate")
const Listing = require("./models/listing.js")
const Review = require("./models/review.js")
const session = require("express-session")
const flash = require("connect-flash")
const passport = require("passport")
const LocalStratergy = require("passport-local")
const User = require("./models/user.js");



const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")
const { listingSchema, reviewSchema } = require("./schema.js")

const listings = require("./routes/listing.js")
const reviews = require("./routes/review.js")
const user = require("./routes/user.js")


app.use(express.urlencoded({ extended: true }))
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"))
app.use(express.static(path.join(__dirname, "public")))
const methodOverride = require("method-override")
app.use(methodOverride("_method"))
app.engine('ejs', ejsmate)




app.listen(port, () => {
    console.log("hello")
})

const mongoose = require("mongoose");
// const Chat=require("./models/chat.js");


main()
    .then(() => {
        console.log("connection successfull")
    })
    .catch((err) => {
        console.log(err)
    })

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/airdata")
}


const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
};

app.use(session(sessionOptions));
app.use(flash());
//used for signup and login with passport 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//locals are used at all places as a variable

app.use((req, res, next) => {
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currUser=req.user;

    next()
})



// app.get("/demo",async(req,res)=>{
//     const fakeUser=new User({
//         email:"yash@gmail.com",
//         username:"yash1910"
//     })

//     const result=await User.register(fakeUser,"1234")
//     res.send(result);
// })
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews)
app.use("/user", user);



app.use((err, req, res, next) => {
    let { status = 500, message = "something went wrong" } = err;

    res.status(status).render("Error.ejs", { err })

})


