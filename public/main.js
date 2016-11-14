var socket = io();
var drawing;
var drawer;
var word;
var same;

var compare= {};

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

var pictionary = function() {

    var canvas, context;

    var draw = function(position) {

        context.beginPath();
        context.arc(position.x, position.y,
            6, 0, 2 * Math.PI);
        context.fill();

    };

    var guessBox;

    var displayGuess = function(guess) {

        $('#showGuess h4').text(guess);
        console.log(guess);

        console.log( word + ' is availbale');

        if(word){

          compare.word= word;
          compare.guess= guess;

          console.log(compare);

         socket.emit('evaluateGuess', compare);

        }

    };

    var displayResult = function(same) {

        if (same === true) {

            $('#wrong').hide();
            $('#correct').show();

        } else {

            $('#correct').hide();
            $('#wrong').show();

        }
    };


    var onKeyDown = function(event) {
        if (event.keyCode != 13) { // Enter
            return;
        }

        var guess = guessBox.val();
        guessBox.val('');
        compare.guess=guess;
        socket.emit('guess', guess);

        displayGuess(guess);

    };



    guessBox = $('#guess input');

    guessBox.on('keydown', onKeyDown);

    socket.on('guess', displayGuess);

    socket.on('displayResult', displayResult);

    canvas = $('canvas');
    context = canvas[0].getContext('2d');
    canvas[0].width = canvas[0].offsetWidth;
    canvas[0].height = canvas[0].offsetHeight;

    // socket.on('drawer', function(drawer){
    //
    //     drawer=true;
    //       console.log(drawer);
    // });
    //
    // socket.on('notDrawer', function(drawer){
    //
    //     drawer=false;
    //      console.log(drawer);
    // });


    socket.on('drawer', function() {

        context.clearRect(0, 0, canvas[0].width, canvas[0].height);
        drawer = true;
        compare= {};
        $('.guesserUi').hide();

        $('#showWord').show();

        index = Math.floor((Math.random() * Words.length));

        word = Words[index];
        // compare.word = word;
        console.log('rrandom word is ' + word);

        $('#showWord h4').text(word);

        console.log('user is a drawer');


    });

    socket.on('notDrawer', function() {
        context.clearRect(0, 0, canvas[0].width, canvas[0].height);
        drawer = false;
        $('#showWord').hide();
        $('.guesserUi').show();

    });

    canvas.on('mousedown', function(event) {
        drawing = true;
    });

    canvas.on('mouseup', function(event) {
        drawing = false;
    });

    canvas.on('mousemove', function(event) {
        console.log(drawer);

        if (drawer === true) {

            var offset = canvas.offset();
            var position = {
                x: event.pageX - offset.left,
                y: event.pageY - offset.top
            };

            if (drawing === true) {

                draw(position);
                socket.emit('draw', position);
            }
        }

    });

    socket.on('draw', draw);
    socket.on('reload', function() {
        location.reload();
    });


};




$(document).ready(function() {


    pictionary();


});
