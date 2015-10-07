var Socket = require('socket.io-client'), SocketConnection="";
var request = require("request");
var cheerio = require("cheerio");
var user_following = new Array();

url_info_user_id = 'https://twitter.com/intent/user?user_id=';
url_info_username = 'https://twitter.com/intent/user?screen_name=';
url_list_users = 'https://mobile.twitter.com';


function connectionSocket(callback){
  // console.log("call socket");
  SocketConnection = Socket('http://localhost:3100');
  SocketConnection.on('connect', function(){
    console.log("Connection correctly to Socket");
    if(callback!=undefined) callback();
  });
}



function get_info_master_user(user,type){

  if(typeof user == 'string'){
    url = url_info_username+user;
  }else{
    url = url_info_user_id+user;
  }

  request({
    uri: url,
  }, function(error, response, body) {
    var $d = cheerio.load(body);

    $d("dd.count > .alternate-context").each(function(i,n) {

      var link = $d(this);
      var text = link.text();
      var l = link.attr('href');
      var type_list = l.split("/")[2];

      if(type == type_list){
        mobile_list_users(l);
      }

    });

  });

}


function mobile_list_users(url){
    request({
      uri: url_list_users+url,
    }, function(error, response, body) {
      console.log(url);
      var $ = cheerio.load(body);
      //console.log($('div.user-list').children());

      $('div.user-list').children().each(function(i,n) {
          //console.log(this);
          //console.log($(this).find("strong").html());
          if($(this).find("strong").html() != null)
            user_following.push($(this));//.find("strong").html());
      });




      link = $('div.w-button-more > a').attr('href');
      if(typeof link == "undefined"){
          console.info("********************************************");
          print_users();
      }else{

          mobile_list_users(link);
      }

    });

}

function print_users(){
  console.log("------------------");
  var result = new Array();
  user_following.forEach(function(item) {

    name = item.find('strong').html();
    link = item.find('td.info > a').last().attr('href');
    username = item.find('span.username').html();
    console.log(name);
    result.push("<a href='http://www.twitter.com"+link+"'>"+name+" - "+username+"</a>");
  });

  if(SocketConnection != null ){
      SocketConnection.emit('push_info_user',result);
  }
  /*
  user_following.each(function(){
    console.log(a(this));
  });*/

}



function main(){

    connectionSocket(function(){
        if(SocketConnection != null ){
            SocketConnection.on('users', function (data) {

              console.log(data);
              if(data.user != undefined && data.type != undefined){
                //type = 'followers';
                //type = 'following'
                get_info_master_user(data.user,data.type);
              }
            });
        }
    });
}

main();
