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

var Words = [
    "word", "letter", "number", "person", "pen", "class", "people",
    "sound", "water", "side", "place", "man", "men", "woman", "women", "boy",
    "girl", "year", "day", "week", "month", "name", "sentence", "line", "air",
    "land", "home", "hand", "house", "picture", "animal", "mother", "father",
    "brother", "sister", "world", "head", "page", "country", "question",
    "answer", "school", "plant", "food", "sun", "state", "eye", "city", "tree",
    "farm", "story", "sea", "night", "day", "life", "north", "south", "east",
    "west", "child", "children", "example", "paper", "music", "river", "car",
    "foot", "feet", "book", "science", "room", "friend", "idea", "fish",
    "mountain", "horse", "watch", "color", "face", "wood", "list", "bird",
    "body", "dog", "family", "song", "door", "product", "wind", "ship", "area",
    "rock", "order", "fire", "problem", "piece", "top", "bottom", "king",
    "space"
];


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



    socket.on('guess', function(guess) {

        socket.broadcast.emit('guess', guess);

        console.log(guess);
    });

    socket.on('disconnect', function() {

        if(socket.id==drawerId){

          console.log('drawer disconnected!!!! ');

            socket.broadcast.emit('reload');

        } else{
          console.log('somebody else did');
        }

        delete clients[socket.id];

    });

});


server.listen(process.env.PORT || 8080);
