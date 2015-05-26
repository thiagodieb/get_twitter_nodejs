var express = require('express');
var router = express.Router();

var session = require('../tools/session');
var user = require('../models/user');


/* GET users listing. */
router.get('/', function(req, res, next) {
  session.check_session(req,res,function(){
    user.find(function(err, users) {
      if (err) {
        return res.send(err);
      }
      res.render('admin_users');
    });
  });
  //res.send('respond with a resource');
});
 

router.route('/user').post(function(req, res) {
  var user = new Users(req.body);
 
  user.save(function(err) {
    if (err) {
      return res.send(err);
    }
 
    res.send({ message: 'User Added' });
  });
});


router.route('/user/:id').put(function(req,res){
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

router.route('/user/:id').get(function(req, res) {
  Users.findOne({ _id: req.params.id}, function(err, user) {
    if (err) {
      return res.send(err);
    }
 
    res.json(movie);
  });
});

router.route('/user/:id').delete(function(req, res) {
  Users.remove({
    _id: req.params.id
  }, function(err, movie) {
    if (err) {
      return res.send(err);
    }
 
    res.json({ message: 'Successfully deleted' });
  });
});


module.exports = router;
