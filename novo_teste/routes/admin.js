var express = require('express');
var crypto = require('crypto');
var connection = require('../model/connection');
var socket_io = require('../model/socket');
var router = express.Router();


var documentsTwitter = connection.model('documents', connection.Schema({name: String}));
var documentsTracks = connection.model('tracks', connection.Schema({name: String}));

var tracks;
/* GET home page. */
router.get('/', function(req, res, next) { 
	
	 res.render('index');

});

/* GET home page. */
router.post('/login', function(req, res, next) {

  if(req.body.User != undefined && req.body.Password != undefined
  	&& req.body.User != "" && req.body.Password != ""){
  		create_session(req.body, function(user){
  			var session_user = req.session;
  			session_user.name=user.name;
  			session_user.email=user.email;
  			res.redirect('/admin');
  			//res.render('index', { title: 'Express',username:user.user});
  		});
  }
});
	
// /* GET home page. */
// router.get('/teste', function(req, res, next) {

// 	socket_io.sockets.emit('twetts', { user:"dieb",text:"novo twitter" });
// 	res.render('index', { title: 'OK' });
 
// }); 

		
/* GET home page. */
router.get('/admin', function(req, res, next) {
	check_session(req,res,function(){
		 	res.render('admin'); 
	});
});

/* GET home page. */
router.get('/admin/painel', function(req, res, next) {
	check_session(req,res,function(){
		return_ = new Array();
		get_terms(function(tracks){
			if(tracks != undefined ){
				return_.terms = tracks;
				result_twitter(tracks,function(result){
					return_.twetts = result;
			   		//console.log(return_);
				 	res.render('admin_painel', return_);
			   	}); 		
			}
		});
	});
});


/* GET home page. */
router.get('/admin/terms', function(req, res, next) {
	return_ = new Array();
	check_session(req,res,function(){
		get_terms(function(tracks){
			//console.log(tracks);
 			if(tracks != undefined ){
 				return_.tracks = tracks;
 				console.log(return_);
				res.render('admin_terms', return_);
			}
		},false,false);
	});
});

router.route('/admin/user').get(function(req, res) {
  Users.find(function(err, users) {
    if (err) {
      return res.send(err);
    }
 
    res.json(users);
  });
});

router.route('/admin/user').post(function(req, res) {
  var user = new Users(req.body);
 
  user.save(function(err) {
    if (err) {
      return res.send(err);
    }
 
    res.send({ message: 'User Added' });
  });
});


router.route('/admin/user/:id').put(function(req,res){
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
 
      res.json({ message: 'User updated!' });
    });
  });
});

router.route('/admin/user/:id').get(function(req, res) {
  Users.findOne({ _id: req.params.id}, function(err, user) {
    if (err) {
      return res.send(err);
    }
 
    res.json(movie);
  });
});

router.route('/admin/user/:id').delete(function(req, res) {
  Users.remove({
    _id: req.params.id
  }, function(err, movie) {
    if (err) {
      return res.send(err);
    }
 
    res.json({ message: 'Successfully deleted' });
  });
});

var check_session = function (req,res,callback){
	var session_user = req.session;
	if(session_user && session_user.name){
		if(callback !=undefined) callback();
	}else{
		res.redirect('/');
	}
}

var create_session = function(body,callback){

	var result = new Array();
	var md5sum = crypto.createHash('md5');
	//"dieb"+"dieb1818"+"app"
	md5sum.update(body.User+body.Password+"app");
	pass = md5sum.digest('hex');

	var query = documentsUsers.findOne({"user":body.User}).where("pass").equals(pass);
	//var query = users.findOne({"user":body.User}).where("email").equals("thiago@dieb.com.br");

	query.exec(function (err, items) {
		if(items != null && items._doc.user == body.User){
			callback(items._doc);
		}
	});

}


var get_terms = function (callback,where,type){
	var query = documentsTracks.find({});
	if(where == undefined)
		query = query.where("status").equals(true);

	query.exec(function (err, data) {
		if(data != null){
			terms = new Array();
			for(var i in data){
				if(type == undefined)
					terms.push(data[i]._doc.term);
				else
					terms.push(data[i]._doc);
			}
			callback(terms);
		}
	});
}

var result_twitter = function (tracks,callback){
	
//	console.log(tracks);
	var result = new Array(); 
	for(index in tracks){
		result[tracks[index]] = new Array();
	}

	query = documentsTwitter.find({})
		.select('timestamp_ms text user retweet_count terms')
		.sort('-timestamp_ms')
		.where('terms').in(tracks)
		.limit(15)
		.exec(function (err, items) {
			//console.log(items);

		  	if (err) return handleError(err);
	  		for (var y in items) {
				item = items[y]._doc;
				if(item.text != undefined){
					twitter = {
						date:item.timestamp_ms,
						text:item.text,
						user:item.user.name,
						retweets:item.retweet_count,
					}; 
					for(index in tracks){
						if(item.terms.indexOf(tracks[index]))
							result[tracks[index]].push(twitter);
					}
					//console.log(twitter);
				}
			}

			callback(result);
	}); 

}

	 
module.exports = router;
