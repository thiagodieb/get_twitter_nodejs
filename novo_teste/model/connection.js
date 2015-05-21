var connection = require('mongoose');
connection.connect('mongodb://localhost:27017/teste');
var db = connection.connection;
db.on('error', console.error.bind(console, 'connection error:'));


module.exports = connection;