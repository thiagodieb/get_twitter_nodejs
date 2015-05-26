var io = require('socket.io');

var socket_io = io.listen(3100);

socket_io.sockets.on('connection', function (socket) {
	console.log('A new user connected!  -  ' + socket.id + " - " + socket.handshake.headers['user-agent']);
	console.log("");
 	socket.on('insert_twetts', function (data) {
 		console.log(socket.id + " - " + socket.handshake.headers['user-agent']);
		console.log(data);
		console.log("");
    	socket_io.sockets.emit('twetts', data);

 	});

 	socket.on('disconnect', function () {
 		console.log('User disconnected!  -  ' + socket.id + " - " + socket.handshake.headers['user-agent']);
	});

});
 

module.exports = socket_io;