var connection = require('./connection');
var crypto = require('crypto');

var Schema = connection.Schema, ObjectId = Schema.ObjectId;

var user = new Schema({  
  _id: ObjectId,
  user: String,
  pass: String,
  name: String,
  email: String,
  created_at: { type: Date, default: Date.now },
  status: Boolean
});

user.methods.checkPassword = function(u,p){
	pass = user.methods.createPassword(u,p);
	return pass === this.pass;
}

user.methods.createPassword = function(u,p){
  var md5sum = crypto.createHash('md5');
  //"dieb"+"123456"+"app"
  md5sum.update(u+p+"app");
  return md5sum.digest('hex');
}

// user.pre('update', function (next) {
//   console.log("pre - update");

//   if(this.pass != ""){
//       this.pass = user.methods.createPassword(this.user,this.pass);
//       console.log("**** Password");
//       console.log(this.pass);
//   }else{
//       delete this.pass;
//   }
//   next();
// });

user.pre('validate', function (next) {
  console.log("validate");
  var ObjectId = require('mongoose').Types.ObjectId; 
  this.status = this.status == true ? true :false;
  this.pass= this.createPassword(this.user,this.pass);
  this._id = new ObjectId();
  next();
});

module.exports = connection.model('users', user);