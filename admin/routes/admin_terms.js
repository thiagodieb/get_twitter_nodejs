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
				var term = {_id:"",term:"",status:""}
				res.locals.term = term;
				res.locals.tracks = tracks;
				next();
			}
		},false,false);
	});
});

/* GET terms */
router.get('/', function(req, res, next) {
	res.render('admin_terms');
}); 

/* GET terms */
router.get('/edit/:id', function(req, res, next) {
	if(req.params.id){
		track.findById(req.params.id, function(err, term) {
		    if (err) {
				console.log(err.message);
		    }else if(term !=undefined && term._doc != undefined){
		    	res.locals.term = term._doc;
				res.render('admin_terms');
			}else{
				res.redirect("..");
			}
		});
	}
}); 
/* GET terms */
router.get('/delete/:id', function(req, res, next) {
	if(req.params.id != undefined){
		track.findOneAndRemove(req.params.id,function(err, term) {
		    if (err) {
	 			console.log(err);
		    }else{
		    	res.redirect("..");	
		    } 		    
		});
	}
}); 
/* GET terms */
router.post('/save', function(req, res, next) {
	req.body.status = req.body.status != undefined ? true :false;
 	if(req.body._id){
  		track.findById(req.body._id).update(req.body,function(err,raw) {
 			if(err){
 				console.log(err);
 			}else{
			    res.locals.msg = "Registro alterado com sucesso !";
				//res.send({redirect: '/admin/terms'});
			    res.redirect(".");
				//res.render('admin_terms');
			}
		});
	}else{
 		var term = new track(req.body);
		term.save(function(err) {
			if (err) {
			  	console.log(err);
			}else{
				res.locals.msg = "Registro salvo com sucesso !";
				res.redirect(".");
			}
		});
	}
}); 

	

module.exports = router;