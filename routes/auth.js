const express = require('express');
const bcrypt = require('bcrypt');  // encrypting password
const router = express.Router();

const User = require('../models/user');



/* ########################################################## SIGN UP ############################################################ */
router.post('/signup', (req, res, next) => {
  
  // if you are logged, you cannot sign up
   if (req.session.currentUser) {
    return res.status(401).json({ code: 'unauthorized' });
  }
  // else store sent values in constants
  const name = req.body.name;
  const cityOfResidence = req.body.cityOfResidence;
  const email = req.body.email;
  const password = req.body.password;
  const cohort = req.body.cohort;

  // if all fields DO NOT have value, trow validation error
  if (!name || !cityOfResidence || !email || !password || !cohort) {
    return res.status(422).json({ code: 'validation' });
  }

  // check if user's email exists, if not make one
  User.findOne({ email }, 'email') // search const email value in field 'email'
    .then((user) => {
      // user found = email is taken
      if (user) {
        return res.status(422).json({ code: 'email-not-unique' });
      }

      // email is free to use, encrypt password
      const salt = bcrypt.genSaltSync(10);
      const hashPass = bcrypt.hashSync(password, salt);

      // make new User, storing filled values (if names of fields and a consts match, just list them)
      const newUser = User({
        name,
        cityOfResidence,
        email,
        password: hashPass,
        cohort
      });

      // save user to db
      return newUser.save()
        .then(() => {
          req.session.currentUser = newUser; // login automatically after signing up
          res.json(newUser);
        });
    })
    .catch(next);
});



/* #########################################################  LOG IN  ########################################################### */
router.post('/login', (req, res, next) => {
  // if you are logged you cannot log in again
  if (req.session.currentUser) {
    return res.status(401).json({ code: 'unauthorized' });
  }
  // else store sent values in constants
  const email = req.body.email;
  const password = req.body.password;

  // if all fields do NOT have value
  if (!email || !password) {
    return res.status(422).json({ code: 'validation' });
  }

  // log in
  User.findOne({ email })
    .then((user) => {
      // user does not exist
      if (!user) {
        return res.status(404).json({ code: 'not-found' });
      }
      // exist, encrypted password does no match
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(404).json({ code: 'not-found' });
      }
      // open session with currentUser (log in)
      req.session.currentUser = user;
      return res.json(user);
    })
    .catch(next);
});


/* ########################################################## LOG OUT ############################################ */

router.post('/logout', (req, res) => {
  req.session.currentUser = null; // session is empty = no user logged
  return res.status(204).send();
}); 


/* ######################################################## ME PATH ############################################# */
// checks if the user is still logged in ( e.g. after refreshing a page)
router.get('/me', (req, res, next) => {
  if (req.session.currentUser) {
    res.json(req.session.currentUser);
  } else {
    res.status(404).json({ code: 'not-found' });
  }
}); 

module.exports = router;



