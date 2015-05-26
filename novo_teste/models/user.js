var connection = require('./connection');
var crypto = require('crypto');

var user = new connection.Schema({  
  user: String,
  pass: String,
  name: String,
  email: String,
  created_at: { type: Date, default: Date.now },
  status: Boolean
});

user.methods.checkPassword = function(u,p){
	var md5sum = crypto.createHash('md5');
	//"dieb"+"123456"+"app"
	md5sum.update(u+p+"app");
	pass = md5sum.digest('hex');

	return pass === this.pass;
}


module.exports = connection.model('users', user);