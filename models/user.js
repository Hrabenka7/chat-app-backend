'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const userSchema = new Schema({
  name: { type: String, required: true },
  cityOfResidence: { type: String, required: true },
  cohort: { type: String, required: true, enum: ['Amsterdam', 'Barcelona', 'Berlin', 'Madrid', 'Mexico City', 'Miami', 'Paris', 'São Paulo'] },
  email: { type: String, required: true },
  password: { type: String, required: true },
  
  picture: { type: String, default: "https://static.change.org/profile-img/default-user-profile.svg" },
  work: {type: String, default: 'Classified'},
  about: {type: String, default: '...'},
  likes: {type: String, default: '...'},
  myStory: {type: String, default: '...'},

})

const User = mongoose.model('User', userSchema);

module.exports = User;
