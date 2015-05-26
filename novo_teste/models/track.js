var connection = require('./connection'); 

var track = new connection.Schema({  
  term: String,
  status: Boolean,
});

module.exports = connection.model('tracks', track);