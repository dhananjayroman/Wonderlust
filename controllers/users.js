const User = require("../models/user");
module.exports.renderSignupForm = (req,res)=>{
    
    res.render("users/signup.ejs")
}




module.exports.signUp = async(req,res,next)=>{
    try {
        const {username,password,email} = req.body;

        const newUser = new User({username,email})
        const registerUser =await User.register(newUser, password)

        req.logIn(registerUser, (err)=>{
          if(err)
          {
            return next(err)
          }
          else{
            console.log("User Register",registerUser)
            res.redirect("/listings")
          }
        })

        
    } catch (error) {
        console.log("Not Register User",error)
    }
}

module.exports.renderLoginForm =  (req,res)=>{
    res.render("users/login.ejs")
}

module.exports.logIn = (req, res) => {
    req.flash("success", "Welcome back! You are logged in 🎉");
    const redirecturl=res.locals.redirectUrl || "/listings"
    res.redirect(redirecturl);
  }


module.exports.logOut = async(req,res)=>{
  req.logOut((err)=>{
    if(err)
    {
      return next(err)
    }
    req.flash("success" ,"You are Logged Out")
    res.redirect("/listings")
  })
}