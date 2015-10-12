var Socket = require('socket.io-client'), SocketConnection="";
var request = require("request");
var cheerio = require("cheerio");


var url_info_user_id = 'https://twitter.com/intent/user?user_id=';
var url_info_username = 'https://twitter.com/intent/user?screen_name=';
var url_list_users = 'https://mobile.twitter.com';
var num_followers = num_following = 0;
var user_following = user_followers = new Array();
var db_result = {};

var res_html = {};

var MongoClient = require('mongodb').MongoClient, assert = require('assert');
var MongoUrl = 'mongodb://localhost:27017/teste';
var MongoConnection;


function connectionSocket(callback){
  // console.log("call socket");
  SocketConnection = Socket('http://localhost:3100');
  SocketConnection.on('connect', function(){
    console.log("Connection correctly to Socket");
    if(callback!=undefined) callback();
  });
}

function connectionDB(callback){
//  console.log("call mongo");
  MongoClient.connect(MongoUrl, function(err, db) {
    console.log("Connected correctly to server DB");
    MongoConnection = db;
    if(callback!=undefined) callback();
  });
}



function get_info_master_user(user){


  if(typeof user == 'string'){
    url = url_info_username+user;
  }else{
    url = url_info_user_id+user;
  }

  db_result.id_user = user;

  request({
    uri: url,
  }, function(error, response, body) {
    var $d = cheerio.load(body);

    db_result.username = $d("span.nickname").html();
    db_result.link = $d("a.tweet-screen-name.user-profile-link").attr("href");
    db_result.name = $d("a.tweet-screen-name.user-profile-link").attr("title");

    $d("dd.count > .alternate-context").each(function(i,n) {

      var link = $d(this);
      var text = link.text();
      console.log(text);
      var l = link.attr('href');
      var type_list = l.split("/")[2];

      eval('num_'+type_list+'='+text);

      list_followers_or_following(l,type_list);


    });

  });

}


function list_followers_or_following(url,type_list){
    request({
      uri: url_list_users+url,
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.81 Safari/537.36' // optional headers
      }
    }, function(error, response, body) {
        console.log(url);
        var $ = cheerio.load(body);
        var initdataTwitter = JSON.parse($('#init-data').html());

        var list_users = initdataTwitter.state.timeline.items;
        list_users.forEach(function(item) {
            eval('user_'+type_list+'.push(item)');
        });

        var link = initdataTwitter.state.timeline.nextCursorEndpoint;

      if(typeof link == "undefined" || link == null){
          console.info("*******************"+type_list+"*******************");
          mount_result(type_list,true);
      }else{
          link = url.split("?")[0] +"?"+link.split("&")[2];
          list_followers_or_following(link,type_list);
      }

    });

}

function mount_result(type_list,save){
  console.log("------------------");

  eval('data_'+type_list+' = new Array()');
  eval("_"+type_list+" = new Array()");

  eval('user_'+type_list).forEach(function(item) {
    id = 0;
    if(item.data.bannerUrl != null){
      //console.log(item.data.bannerUrl);
      id = item.data.bannerUrl.split('/')[4];
      item.data.id_user = id;
    }
    username = item.data.screenName;
    name = item.data.displayName;
    link = item.data.profileUrl;
    followerCount = item.data.followerCount;
    followingCount =  item.data.followingCount;

    eval('_'+type_list).push("<a href='"+link+"'>id: "+id+" | name:"+name+" - @"+username+" (followers:"+followingCount+") | (following:"+followingCount+")</a>");
    eval('data_'+type_list).push(item);
  });

  res_html[type_list] = eval('_'+type_list);

  n = eval('num_'+type_list);
  d = eval('data_'+type_list);

  db_result[type_list] = {'number':n,'data':d};

  finish(save);
}

function finish(save){

  if(typeof db_result.following != 'undefined' &&
    db_result.following.hasOwnProperty('data') &&
    typeof db_result.followers != 'undefined' &&
    db_result.followers.hasOwnProperty('data') ){

        send_return_frontend();
      if(save){
        save_db();
      }
  }
}

function send_return_frontend(){

  if(SocketConnection != null ){
      SocketConnection.emit('push_info_user',res_html,function(){
        res_html = {};
      });
  }

}

function save_db(){

  if(MongoConnection != null){
    MongoConnection.collection('users_twitter').save(db_result, function(err, res) {
        assert.equal(err, null);
        console.log(res);
        db_result = {};
    });
  }

}

function check_user_db(id){

  MongoConnection.collection('users_twitter', function(err, collection) {
        collection.findOne({'id_user':id}, function(err, item) {
            if(item == null){
              console.log("Nenhum resultado no banco");
              get_info_master_user(id);
            }else{
              console.log("Resultado encontrado ");
              data = ['followers','following'];
              user_following= item.following.data;
              user_followers= item.followers.data;
              data.forEach(function(key){
                console.log(key);
                mount_result(key,false);
              });
            }
        });
    });

}

function main(){

  connectionDB(function(){
    connectionSocket(function(){
        if(SocketConnection != null ){
            SocketConnection.on('users', function (data) {

              console.log(data);
              if(data.user != undefined){
                  check_user_db(data.user);
              }

            });
        }
    });
  });


}

main();
