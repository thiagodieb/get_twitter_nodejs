var express = require('express');
var router = express.Router();

var session = require('../tools/session');
var users_twitter = require('../models/users_twitter');


/* CheckSession All */
router.use(function(req, res, next) {
  session.check_session(req,res,function(){
    console.log(' ***** %s %s %s', req.method, req.url, req.path);
    users_twitter.find(function(err, u_t) {
      if (err) {
        console.log(err)
        res.send(err);
      }else if(u_t != undefined ){
        res.locals.user = {_id:"",id_user:"",name:"",username:"",following:"",followers:""};
        res.locals.users = u_t;

        next();
      }
    });
  });
});


/* GET users */
router.get('/', function(req, res, next) {
	res.render('admin_users_twitter');
});

/* GET terms */
router.get('/edit/:id', function(req, res, next) {
	if(req.params.id){
		users_twitter.findById(req.params.id, function(err, u_t) {
		    if (err) {
				console.log(err.message);
		    }else if(u_t !=undefined && u_t._doc != undefined){
		    	res.locals.user = u_t._doc;
				res.render('admin_users_twitter');
			}else{
				res.redirect("..");
			}
		});
	}
});
/* GET terms */
router.get('/delete/:id', function(req, res, next) {
	if(req.params.id != undefined){
		users_twitter.findOneAndRemove(req.params.id,function(err, u_t) {
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
  		users_twitter.findById(req.body._id).update(req.body,function(err,raw) {
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
 		var user = new users_twitter(req.body);
		user.save(function(err) {
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
