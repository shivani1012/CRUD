const express = require("express");
const bcrypt = require("bcryptjs");
const passport = require('passport');
const router = express.Router();


const User_Schema = require("../models/User");



router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/show_task",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/Register", (req, res) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  let errors = [];
  if (!req.body.name) {
    // console.log("email is not valid");
    errors.push({ message: "please enter the name" });
  }
  if (!req.body.email || !emailRegex.test(req.body.email)) {
    // console.log("email is not valid");
    errors.push({ message: "email is not valid" });
  }
  if (!req.body.password || req.body.password.length < 6) {
    errors.push({ message: "password length should be more then six " });
  }
  if (req.body.password !== req.body.password2) {
    errors.push({ message: "password not matched" });
  }
  if (errors.length > 0) {
    res.render("register", {
      name: req.body.name,
      email: req.body.email,
      error: errors,
    });
  } 
  else{
        User_Schema.findOne({email : req.body.email})
        .then((user) => {
            if(user){
                req.flash("error_msg", "User already exist with this email!");
                res.redirect("/Register");
              } 
            else
            {
            const newRgister = new User_Schema({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
            });
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(newRgister.password, salt, function(err, hash) {
                    if (err) throw err;
                    newRgister.password = hash
                    newRgister
                    .save()
                    .then(() => {
                        req.flash('success_msg','Register successfully')
                        res.redirect("/login")
                    })
                    .catch((err) => {
                        console.log(err)
                    });
                });
            });
            
            }
        })
  }
  


    
});


router.get('/logout', (req,res) => {
  req.logOut();
  req.flash('success_msg' , 'you are logged out')
  res.redirect('/login')
})

module.exports = router;