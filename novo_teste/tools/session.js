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
	user.findOne({"user":body.User}).exec(function (err, items) {
		if(items != null && items.checkPassword(body.User,body.Password)){
			callback(items._doc);
		}
	});
}
	 
module.exports = session;

