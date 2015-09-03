var track = require('../models/track');
var tweet = require('../models/tweet');

var twitte_tools = {}

twitte_tools.get_terms = function (callback,where,type){
	var query = track.find({});
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

twitte_tools.result_twitter = function (term,callback){
	
	console.log(term);
	var result = new Array(); 
	//for(index in tracks){
	//	term = tracks[index];
	//	result[term] = new Array();
		//console.log(term);
		query = tweet.find({})
			.select('timestamp_ms text user retweet_count terms')
			.sort('-timestamp_ms')
			.where('terms').equals(term)
			.exec(function (err, items) {
				
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
						result.push(twitter);/*
						for(index in tracks){
							if(item.terms.indexOf(tracks[index]))
								result[tracks[index]].push(twitter);
						}*/
						//console.log(twitter);
					}
				}

				callback(result);
		}); 
	//}
}

module.exports = twitte_tools;