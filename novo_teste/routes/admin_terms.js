var express = require('express');
var router = express.Router();

var session = require('../tools/session');
var track = require('../models/track');

var twitte_tools = require('../tools/twitte_tools');

/* CheckSession All */
router.use(function(req, res, next) {
	session.check_session(req,res,function(){
		console.log(' ***** %s %s %s', req.method, req.url, req.path);
		twitte_tools.get_terms(function(tracks){
			if(tracks != undefined ){
				res.locals.tracks = tracks;
				next();
			}
		},false,false);
	});
});

/* GET terms */
router.get('/', function(req, res, next) {
	var term = {_id:"",name:"",status:""}
	res.locals.term = term;
	res.render('admin_terms');
}); 

/* GET terms */
router.get('/edit/:id', function(req, res, next) {
 		track.findOne({ _id: req.params.id }, function(err, term) {
		    if (err) {
		      return res.send(err);
		    }
	    	res.locals.term = term._doc;
			res.render('admin_terms');
		});
}); 

/* GET terms */ 
router.post('/edit/:id', function(req, res, next) {


	Users.findOne({ _id: req.params.id }, function(err, user) {
    if (err) {
      return res.send(err);
    }
 
    for (prop in req.body) {
      user[prop] = req.body[prop];
    }
 
    // save the movie
    user.save(function(err) {
      if (err) {
        return res.send(err);
      }
 


 		track.findOne({ _id: req.params.id }, function(err, term) {
		    if (err) {
		      return res.send(err);
		    }

 		  
		});
}); 
	

module.exports = router;
