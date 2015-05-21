var Twitter = require('twitter');
var Socket = require('socket.io-client'), SocketConnection="";


var Client = new Twitter({
  consumer_key: "w20rrmHlUQHyqXHQHjnumg",
  consumer_secret: "Akhf6fSNdBol3uMjMnvSN9wR0c1cNCTdNGKYzZm27U",
  access_token_key: "45654264-bCw1gVJjINL5hUFgTKh18NlxWZHDu5lk25d6ByQ1M",
  access_token_secret: "Vf8cVvaRk1anNpGDXBcDrw3ifDfpHSTc7CjbPkWl8g",

});

var MongoClient = require('mongodb').MongoClient, assert = require('assert');
var MongoUrl = 'mongodb://localhost:27017/teste';
var MongoConnection;
var Tracks = "";
var TimeIntevalTracks = 5000;
var streamStop;


function main(){
  connectionSocket();
  connectionDB(function(){
      setInterval(
        function(){
          getTracks(MongoConnection,executeStreaming);
        },TimeIntevalTracks);
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

function connectionSocket(callback){
  // console.log("call socket");
  SocketConnection = Socket('http://localhost:3100');
  SocketConnection.on('connect', function(){
    console.log("Connection correctly to Socket");
    if(callback!=undefined) callback();
  });
}

function getTracks(db,callback){
      var collection = db.collection('tracks');
      collection.find({status:true},{term:1}).toArray(function(err, docs) {
          assert.equal(err, null);
          //assert.equal(2, docs.length);
          //console.log(" ****** Tracks ****");
          //console.log("");
          result = "";
          for (var i in docs) {
            result+=docs[i].term+",";
           }
          //console.log(result);
          if(result != Tracks){
            Tracks = result;
            console.log("****** Tracks modifed: ( " + Tracks + ") ******");
            if(callback!=undefined){
              if(streamStop != undefined){
                console.log("call streamStop()");
                streamStop();
              }
              callback(Tracks,db);
            }
          }

        });
}

function filterTerms(tracks,tweet){

  tweet.terms = new Array();
  terms = tracks.split(",");
  console.log(tweet.text);

  for(var i in terms ){
      term = terms[i];
      if(term != "" 
        && tweet.text != undefined
        && tweet.text.search(new RegExp(term, "i")) != -1){
        tweet.terms.push(term);
        //console.log(term);
        console.log("******* ( "+ term +" ) ***** " + tweet.text.search(new RegExp(term, "i")));
      }
  }
  return tweet;
}

function executeStreaming(tracks,db){

    Client.stream('statuses/filter', {track: tracks},  function(stream){
      console.log("Stream Started");
      stream.on('data', function(tweet) {
        console.log("--------------------------------------- "+ tracks);
        if(tweet != undefined){
            var collection = db.collection('documents');
            tweet = filterTerms(tracks,tweet);
 
             collection.insert(tweet, function(err, result) {
              //console.log(result);
              assert.equal(err, null);
              
              if(SocketConnection != null && tweet != undefined && tweet.user != undefined && tweet.user.name != undefined){
                SocketConnection.emit("insert_twetts", {user: tweet.user.name, text: tweet.text, terms: tweet.terms, date:tweet.timestamp_ms});  
              }

              console.log("****** Inserted *******");
              console.log("");

            });
        }else{
          console.log("ERROR: *****************");
        }
      });

      stream.on('error', function(error) {
        console.log(error);
        db.close()
      });
      
      streamStop = function (){
          stream.destroy();
      }

    });
}



main();