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

  socket.on('pull_info_user', function (data) {
    console.log("get_info:   "+socket.id + " - " + socket.handshake.headers['user-agent']);
      socket_io.sockets.emit('users', data);

  });
  socket.on('push_info_user', function (data) {
    console.log("get_info:   "+socket.id + " - " + socket.handshake.headers['user-agent']);
    socket_io.sockets.emit('result_users', data);

  });

 	socket.on('disconnect', function () {
 		console.log('User disconnected!  -  ' + socket.id + " - " + socket.handshake.headers['user-agent']);
	});

});


module.exports = socket_io;
