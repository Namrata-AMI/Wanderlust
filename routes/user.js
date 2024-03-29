const express = require("express");
const router = express.Router(); 
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js")

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup",wrapAsync(async(req,res)=>{
   try{
    let {username, email, password} = req.body;
    const newUser = new User ({username,email});
    const registeredUser = await User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{          // using passport login method to make user already login after sign-in//
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to Wanderlust!!");
        res.redirect("/listings");
    });
   }
   catch(e){
    req.flash("error",e.message);
    res.redirect("/signup");
   }
}));


router.get("/login",(req,res)=>{
    res.render("users/login.ejs")
});

router.post("/login",
saveRedirectUrl,                   // just before authenticate we store SaveredirectUrl//
passport.authenticate("local",
{failureRedirect:"/login",               //used middleware "passport.authenticate()"//
failureFlash: true}),(req,res)=>{
req.flash("success","Welcome to Wanderlust, Successfully logged-in");
//res.redirect(req.session.redirectUrl); // it will not work because passport after authenticate clears the session and removes this fnx//
let redirectUrl = res.locals.redirectUrl || "/listings";  // if url not then by default "/listings"//
res.redirect(redirectUrl);  
});


router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "you looged out!");
        res.redirect("/listings");
    })
})


module.exports = router;