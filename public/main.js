var socket = io();
var drawing;
var drawer= true;

var pictionary = function() {


    var canvas, context;

    var draw = function(position) {

        context.beginPath();
        context.arc(position.x, position.y,
            6, 0, 2 * Math.PI);
        context.fill();

    };

    var guessBox;

    var displayGuess= function(guess){
          $('#showGuess h4').text(guess);
          console.log(guess);
        
    };

    var onKeyDown = function(event) {
        if (event.keyCode != 13) { // Enter
            return;
        }
          var guess = guessBox.val();

        guessBox.val('');
        socket.emit('guess', guess);
        displayGuess(guess);

    };

    guessBox = $('#guess input');
    guessBox.on('keydown', onKeyDown);

    socket.on('guess', displayGuess);


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

    canvas.on('mousedown', function(event) {
        drawing = true;
    });

    canvas.on('mouseup', function(event) {
        drawing = false;
    });

    canvas.on('mousemove', function(event) {

          if(drawer===true){

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

};




$(document).ready(function() {

    pictionary();


});
