var express = require('express');
var crypto = require('crypto');
var connection = require('../models/connection');
var router = express.Router();

var session = require('../tools/session');

/* GET home page. */
router.get('/', function(req, res, next) { 
	 res.render('index');
});

/* POST login. */
router.post('/login', function(req, res, next) {

  if(req.body.User != undefined && req.body.Password != undefined
  	&& req.body.User != "" && req.body.Password != ""){
  		session.create_session(req.body, function(user){
        console.log(user);
        if(user){
    			var session_user = req.session;
    			session_user.name=user.name;
    			session_user.email=user.email;
    			res.redirect('/admin');
        }else{
          res.redirect('/');    
        }
  		});
  }
}); 

module.exports = router;
