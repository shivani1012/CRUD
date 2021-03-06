const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bycrypt = require('bcryptjs')


const User_Schema = require('../models/User');

module.exports = function (passport) {
    passport.use(
      new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
        User_Schema.findOne({
          email: email,
        })
          .then((user) => {
            if (!user) {
              return done(null, false, { message: "no user found" });
            }
            else{
                bycrypt.compare(password, user.password, (err,isMatched) => {
                    if(err) throw err;
                    if(isMatched){
                        return done(null,user)  
                    }
                    else{
                        return done(null,false,{message : "Passowrd not matched"})
                    }
                })
            } 
          })
          .catch((err) => {
            console.log(err);
          });
      })
    );
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User_Schema.findById(id, function(err, user) {
          done(err, user);
        });
      });
};