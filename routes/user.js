const express = require("express");
const router = express.Router(); 
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

const userController = require("../controllers/user.js");


router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));



router.route("/login")
.get(userController.renderLoginForm)
.post(
saveRedirectUrl,                   // just before authenticate we store SaveredirectUrl//
passport.authenticate("local",
{failureRedirect:"/login",               //used middleware "passport.authenticate()"//
failureFlash: true}),userController.login);





router.get("/logout",userController.logOut);


module.exports = router;