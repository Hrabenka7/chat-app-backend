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
router.put("/:id", (req, res, next) => {
  // save body values into a new object newData
  const newData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    cohort: req.body.cohort
  }
  
  const options = {
    new: true
  }

  // find the user based on his id from url
  User.findById(req.params.id)
    .then((result) => {
      // no user with such id
      if (!result) {
        return res.status(404).json({ code: 'not-found' });
      }
      // else rewrite the old data with the new data
      result.firstName = newData.firstName;
      result.lastName = newData.lastName;
      result.cohort = newData.cohort;

      // and save to db
      result.save()
        .then(() => {
          res.json(result);
        })
        .catch(next);
    })
    .catch(next)
});

module.exports = router;
