const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/user')

/* ######################################  GET profile page. ##########################*/
// find the User based on his id read from the url
router.get("/:id", (req, res, next) => {
  User.findById(req.params.id)
    .then((result) => {
      res.json(result);
    })
    .catch(next)
});

/* #################################### EDIT profile page ######################## */
router.put("/me", (req, res, next) => {
   if (!req.session.currentUser) {
    return res.status(401).json({ code: 'unauthorized' });
  }
  // save body values into a new object newData
  const newData = {
    name: req.body.name,
    cohort: req.body.cohort,
    cityOfResidence: req.body.cityOfResidence,
    work: req.body.work,
    about: req.body.about,
    likes: req.body.likes,
    myStory: req.body.myStory,
    skills: req.body.skills
  }

  const updates = {
    $set: newData
  };
  const options = {
    new: true
  };

  // find the user based on his id from url
  User.findOneAndUpdate({_id: req.session.currentUser}, updates, options)
    .then((result) => {
      req.session.currentUser = result;
      res.json(result);
    })
    .catch(next)
    
    User.findOneAndUpdate({ _id: req.session.currentUser }, { $addToSet: { skills: req.body.skills }}, options)
  });
  

  // ####################################### ADD NEW SKILL ############################ //
    
  router.put("/edit-my-skills", (req, res, next) => {
    if (!req.session.currentUser) {
      return res.status(401).json({ code: 'unauthorized' });
    }
  
    const options = {
      new: true
    };

    // find the user based on his id from url and add new skill
    User.findOneAndUpdate({ _id: req.session.currentUser._id }, { $push: { skills: req.body.newSkill } }, options)
      .then((result) => {
        req.session.currentUser = result;
        res.json(result);
      })
      .catch(next)
  });




module.exports = router;
