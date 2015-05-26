var connection = require('./connection');

var tweet = new connection.Schema({  
  created_at: { type: Date, default: Date.now },
  id: Number,
  id_str: Number,
  text: String,
  source: String,
  truncated: Boolean,
  in_reply_to_status_id: String,
  in_reply_to_status_id_str: String,
  in_reply_to_user_id: String,
  in_reply_to_user_id_str: String,
  in_reply_to_screen_name: String,
  user: Object,
  geo:String,
  coordinates:String,
  place:String,
  contributors:String,
  retweet_count:Number,
  favorite_count:Number,
  entities: Object,
  favorited:Boolean,
  retweeted:Boolean,
  possibly_sensitive:Boolean,
  filter_level:String,
  lang:String,
  timestamp_ms:Number,
  terms: []
});

module.exports = connection.model('documents', tweet);