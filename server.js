const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const Handlebars = require("handlebars");
const bodyParser = require("body-parser");
const passport = require('passport');
const methodOverride = require("method-override");
const session = require('express-session')
const flash = require('express-flash');


const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

const app = express();
const port = 6000;

const mongoDBURL = require("./config/keys");

const Task_Schema = require("./models/Tasks");
const User_Schema = require("./models/User")




mongoose
  .connect(mongoDBURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("mongodb is connected"))
  .catch((err) => console.log(err));

app.engine(
  "handlebars",
  exphbs({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);
app.set("view engine", "handlebars");



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// override with POST having ?_method=DELETE
app.use(methodOverride("_method"));





app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));


app.use(passport.initialize());
app.use(passport.session());


app.use(flash())

//golabal variable 
app.use((req,res,next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  res.locals.user =  req.user || null
  next()
})


require('./config/passport')(passport)

r
app.get("/about", (req, res) => {
  res.render("about");
});

// render greet message
app.get("/", (req, res) => {
  const greet = "Welcome To Curd Application";
  res.render("index", {
    greetMessage: greet,
  });
});

app.get("/add_task", (req, res) => {
  res.render("add");
});



// app.use(function (req, res, next) {
//   console.log(Date.now());
//   next();
// });

// app.use(function (req, res, next) {
//   req.greeting = "hello";
//   next();
// });

// app.use(function (req, res, next) {
//   console.log(req.greeting);
//   next();
// });

// app.use((req, res, next) => {
//   console.log("i am running");
//   next();
// });

const TaskRoute = require('./router/TaskRoute');
const UserRoute = require('./router/UserRouter');
app.use('/', TaskRoute, UserRoute);

app.listen(port, () => {
  console.log(`port is running on ${port}`);
})