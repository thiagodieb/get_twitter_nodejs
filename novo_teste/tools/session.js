var user = require('../models/user');

var session = {}
session.check_session = function (req,res,callback){
	var session_user = req.session;
	if(session_user && session_user.name){
		if(callback !=undefined) callback();
	}else{
		res.redirect('/');
	}
}

session.create_session = function(body,callback){
	
	user.findOne({"user":body.User,"status":true}).exec(function (err, item) {
		var u;
		if(item != null && item.checkPassword(body.User,body.Password)){
			u = item._doc;
		}
		callback(u);
	});
}
	 
module.exports = session;

