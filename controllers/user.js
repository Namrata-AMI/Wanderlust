const User = require("../models/user.js");



module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
}


module.exports.signup = async(req,res)=>{
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
 }


module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs")
};


module.exports.login = (req,res)=>{
    req.flash("success","Welcome to Wanderlust, Successfully logged-in");
    //res.redirect(req.session.redirectUrl); // it will not work because passport after authenticate clears the session and removes this fnx//
    let redirectUrl = res.locals.redirectUrl || "/listings";  // if url not then by default "/listings"//
    res.redirect(redirectUrl);  
    }


module.exports.logOut = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "you looged out!");
        res.redirect("/listings");
    })
};