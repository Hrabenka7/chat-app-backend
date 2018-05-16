'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const messageSchema = new Schema({
  user: { type: ObjectId, required: true},
  message: { type: String, required: true },
  timeStamp: { type: Date, required: true },
})

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;