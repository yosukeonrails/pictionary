var http = require('http');
var express = require('express');
var socket_io = require('socket.io');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);
var id;
var drawer;
var clients = {};
var drawerId;
var lastGuesser;



io.on('connection', function(socket) {


    clients[socket.id] = socket.id;


    console.log(Object.keys(clients));


    if (Object.keys(clients).length === 1) {

        socket.emit('drawer', drawer);

        drawerId= socket.id;

    } else {
        socket.emit('notDrawer', drawer);
      console.log('not a drawer');
    }


    socket.on('draw', function(position) {

        socket.broadcast.emit('draw', position);

    });

   socket.on('evaluateGuess', function(compare){



        if(compare.guess===compare.word){

            same= true;
            socket.broadcast.emit('displayResult', same);


            socket.broadcast.emit('notDrawer');
            socket.emit('notDrawer');
            io.to(lastGuesser).emit('drawer');


        } else {

          same= false;
          socket.broadcast.emit('displayResult', same);
        }

   });


    socket.on('guess', function(guess) {

        socket.broadcast.emit('guess', guess);

        lastGuesser=socket.id;


        // socket.broadcast.emit('evaluateGuess', guess);
        // socket.emit('evaluateGuess', guess);

        console.log(guess);

    });



    socket.on('disconnect', function() {

        if(socket.id == drawerId){

          console.log('drawer disconnected!!!! ');

            socket.broadcast.emit('reload');

        } else{
          console.log('somebody else did');
        }

        delete clients[socket.id];

    });

});


server.listen(process.env.PORT || 8080);
