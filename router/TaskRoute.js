const express = require("express");
const router = express.Router()
const Task_Schema = require("../models/Tasks");

//edit task
router.get("/edit_task/:id", (req, res) => {
    Task_Schema.findOne({ _id: req.params.id })
      .then((data) => {
        res.render("edit", {
          Key_Edit: data,
        });
  
        // console.log(data)
      })
  
      .catch((err) => {
        console.log(err);
      });
  });
  
  // show added task
  router.get("/show_task", (req, res) => {
    Task_Schema.find({})
      .sort({ date: "desc" })
      .then((data) => {
        res.render("viewTasks", {
          taskData: data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
  
  // add task first step
  router.post("/add_task", (req, res) => {
    let errors = [];
  
    if (!req.body.title) {
      errors.push({ text: "Title should not be empty" });
    }
    if (!req.body.details) {
      errors.push({ text: "Details should not be empty" });
    }
    if (errors.length > 0) {
      res.render("add", {
        title: req.body.title,
        details: req.body.details,
        errors: errors,
      });
    } else {
      const newTask = {
        title: req.body.title,
        details: req.body.details,
      };
      const task = new Task_Schema(newTask);
      task
        .save()
        .then((data) => {
          req.flash('success_msg','Task added successfully')
          res.redirect("/show_task");
        })
        .catch((err) => console.log(err));
    }
  });
  
  // PUT METHOD For EDIT
  router.put("/show_task/:id", (req, res) => {
    Task_Schema.findOne({ _id: req.params.id })
      .then((data) => {
        data.title = req.body.title;
        data.details = req.body.details;
        data
          .save()
          .then((data) => {
            res.redirect("/show_task");
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => {
        console.log(err);
      });
  });
  
  // delete post
  router.delete("/delete/:id", (req, res) => {
    Task_Schema.remove({ _id: req.params.id })
      .then(() => {
        res.redirect("/show_task");
      })
      .catch((err) => {
        console.log(err);
      });
  });

 
module.exports = router;