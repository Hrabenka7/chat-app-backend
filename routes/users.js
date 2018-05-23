const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/user')
const upload = require('../configs/cloudinary');

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
    skills: req.body.skills // ref. input "name"; profile.component.html 
  }

  const updates = {
    $set: newData      // mongodb $set operator replace value of a field(s)
  };

  const options = {
    new: true         // by default, mongoose returns the old object. Setting options to "new:true" returns UPDATED object.  
  };

  // find the user based on his id taken from session and replace the first one matching
  User.findOneAndUpdate({_id: req.session.currentUser}, updates, options)
    .then((result) => {
      req.session.currentUser = result;  // updates the user in session !important for the /me request
      res.json(result);
    })
    .catch(next)
    
  });
  

// ---------- UPLOAD USER PICTURE --------- //
  router.put('/me/picture', upload.single('image'), function (req, res, next) {
    console.log(req.file)
    const image = req.file.url
    const userId = req.session.currentUser._id;

    if (!image) {
      res.status(422).json({ code: "unprocessable-entity" })
    }

    User.findByIdAndUpdate(userId, { picture: image }, { new: true })
      .then((result) => {
        req.session.currentUser = result;
        res.json(result);
      })
      .catch(next);
  });



module.exports = router;
