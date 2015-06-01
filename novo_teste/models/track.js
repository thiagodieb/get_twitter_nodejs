var connection = require('./connection'); 
var Schema = connection.Schema, ObjectId = Schema.ObjectId;

var track = new Schema({  
  _id: ObjectId,
  term: String,
  status: Boolean,
});
 
track.pre('validate', function (next) {
  var ObjectId = require('mongoose').Types.ObjectId; 
  this.status = this.status == true ? true :false;
  this._id = new ObjectId();
  console.log(this);
  next();
})

module.exports = connection.model('tracks', track);