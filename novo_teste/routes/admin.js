var express = require('express');
var router = express.Router();

var socket_io = require('../tools/socket');
var session = require('../tools/session');
var twitte_tools = require('../tools/twitte_tools');
		

/* CheckSession All */
router.use(function(req, res, next) {
	session.check_session(req,res,function(){
		console.log(' ***** %s %s %s', req.method, req.url, req.path);
		next();
	});
});

/* GET home page. */
router.get('/', function(req, res, next) {
 		 	res.render('admin'); 
});

/* GET painel. */
router.get('/painel', function(req, res, next) {
 		return_ = new Array();
		twitte_tools.get_terms(function(tracks){
			if(tracks != undefined ){
				return_.terms = tracks;
				///twitte_tools.result_twitter(tracks,function(result){
					//return_.twetts = result;
			   		//console.log(return_);
				 	
			   //	}); 		
			}
			res.render('admin_painel', return_);
		});
});


router.get('/load/:term', function(req, res, next) {
  	if(req.params.term != undefined && req.params.term != ""){
  		twitte_tools.result_twitter(req.params.term,function(result){
			//return_.twetts = result;
			res.json(result);
	   	});
  	}
}); 
 
module.exports = router;
