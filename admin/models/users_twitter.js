var connection = require('./connection');
var Schema = connection.Schema, ObjectId = Schema.ObjectId;

var users_twitter = new Schema({
  _id: ObjectId,
  id_user: Number,
  name: String,
  username: String,
  link: String,
  following: {},
  followers: {},
});

users_twitter.pre('validate', function (next) {
  var ObjectId = require('mongoose').Types.ObjectId;
  this.status = this.status == true ? true :false;
  this._id = new ObjectId();
  console.log(this);
  next();
})

module.exports = connection.model('users_twitter', users_twitter);
