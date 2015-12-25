var express = require('express');
var router = express.Router();

var session = require('../tools/session');
var user = require('../models/user');

/* CheckSession All */
router.use(function(req, res, next) {
  session.check_session(req,res,function(){
    console.log(' ***** %s %s %s', req.method, req.url, req.path);
    user.find(function(err, users) {
      if (err) {
        console.log(err)
        res.send(err);
      }else if(users != undefined ){
        res.locals.user = {_id:"",user:"",name:"",email:"",pass:"",status:""};
        res.locals.users = users;
        next();
      }
    });
  });
});

/* GET users */
router.get('/', function(req, res, next) {
  res.render('admin_users');
}); 

/* GET user */
router.get('/edit/:id', function(req, res, next) {
  if(req.params.id){
    user.findById(req.params.id, function(err, u) {
        if (err) {
          console.log(err.message);
        }else if(u !=undefined && u._doc != undefined){
          res.locals.user = u._doc;
          res.locals.user.pass = "";
        res.render('admin_users');
      }else{
        res.redirect("..");
      }
    });
  }
}); 

/* GET user */
router.get('/delete/:id', function(req, res, next) {
  if(req.params.id != undefined){
    user.findOneAndRemove(req.params.id,function(err, u) {
        if (err) {
          console.log(err);
        }else{
          res.redirect(".."); 
        }         
    });
  }
}); 

/* GET user */
router.post('/save', function(req, res, next) {
  req.body.status = req.body.status != undefined ? true :false;
  if(req.body._id){
      if(req.body.pass != ""){
        u = new user();
        req.body.pass = u.createPassword(req.body.user,req.body.pass);
      }else{
        delete req.body.pass;
      }
      user.findById(req.body._id).update(req.body,function(err,raw) {
        if(err){
          console.log(err);
        }else{
          res.locals.msg = "Registro alterado com sucesso !";
          res.redirect(".");
        }
      });
  }else{
    var u = new user(req.body);
    u.save(function(err) {
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