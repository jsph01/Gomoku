$(document).ready(function() {  
  // called automatically when the page is loaded.
    $("#divHelpText").hide();
    const gomoku = new Gomoku('#gomoku'); // create the Gomoku object.

    // these are the application event listeners.
    gomoku.onPlayerMove = function() {
      $('#player').text(gomoku.player); //gets called when the player makes a move.
    }
    $('#help').click(function() {

      $("#divHelpText").show();

    })
    $("#restart").focus(); // when the page loads put the focus on this button.
 
    $('#restart').click(function() { //This gets called when the user clicks on the restart button.
      gomoku.restart();
    })
    $('#autoPlay').click(function() { //This gets called when the user clicks on the autoPlay button.
      gomoku.setAutoPlay(true);
    })
  });
