var connection = require('mongoose');
connection.connect('mongodb://localhost:27017/collector');
connection.connection.on('error', console.error.bind(console, 'connection error:'));

module.exports = connection;

