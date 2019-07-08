                                                          //  creating a class and objects for the game 
class Gomoku {   
    constructor(selector) {                               // pass the selector 
    this.autoPlayFlag=false;                              // artifical intelligence 
    this.ROWS = 6;                                        // build rows
    this.COLS = 7;                                        // build columns
    this.player = 'white';                                // player type 
    this.selector = selector;                             
    this.isGameOver = false;
    this.onPlayerMove = function() {};
    this.createGrid();       
    this.setupEventListeners();
  }
                    
  setAutoPlay(flag){                                      // gets called when user clicks the auto play button to set the auto play flag.
    this.autoPlayFlag=flag;
  }                                                 
  createGrid() {                                          // creating the grid                                                                    
    const $board = $(this.selector);
    $board.empty();
    this.isGameOver = false;
    this.player = 'white';
    for (let row = 0; row < this.ROWS; row++) {           // for loop to interate through rows. 
      const $row = $('<div/>')                            // creating the rows with divs in jquery 
        .addClass('row');                                 // class rows nested inside the divs 
      for (let col = 0; col < this.COLS; col++) {         // for loop to interate through columns. 
        const $col = $("<div/>")  
        .addClass('col empty')
          .attr('data-col', col)
          .attr('data-row', row);
        $row.append($col);
        
      } 
      $board.append($row);                                // rows and columns 
    }
  }
    
  setupEventListeners() {                                 // set up event listerners for a specified element such as hoovering and 
    const $board = $(this.selector);
    const that = this;
    function findLastEmptyCell(col) {
      const cells = $(`.col[data-col='${col}']`);
      for (let i = cells.length - 1; i >= 0; i--) {
        const $cell = $(cells[i]);
        if ($cell.hasClass('empty')) {
          return $cell;
        }
      }
      return null;
    }

                                                          // called when the mouse enters an empty column, using two arguments to invoke the function
    $board.on('mouseenter', '.col.empty', function() {     
      if (that.isGameOver) return;
      const col = $(this).data('col');
      const $lastEmptyCell = findLastEmptyCell(col);
      $lastEmptyCell.addClass(`next-${that.player}`);
    });
                                                          // called when the mouse leaves a column
    $board.on('mouseleave', '.col', function() {
      $('.col').removeClass(`next-${that.player}`);
    });
                                                          // called when the player clicks on an empty column.
    $board.on('click', '.col.empty', function() {
      $("#divHelpText").hide();
      if (that.isGameOver) return;
      const col = $(this).data('col');
      const row = $(this).data('row');
      const $lastEmptyCell = that.findLastEmptyCell2(col,row);
      $lastEmptyCell.removeClass(`empty next-${that.player}`);
      $lastEmptyCell.addClass(that.player);
      $lastEmptyCell.data('player', that.player);

                                                          // call the isWinner method and if returns true the game is over.
      if (that.isWinner($lastEmptyCell)) {
        that.isGameOver = true;
        $('.col.empty').removeClass('empty');

        $("#divMessage").html(`You! Player ${that.player} has won!`);

        return;
      }

                                                          // check autoPlayFlag if true call the auto play method, otherwise it is the next players turn.
      const $autoCell=(that.autoPlayFlag?that.autoPlay():null);

      if ($autoCell!=null) 
      {
        $autoCell.removeClass(`empty next-${that.player}`);
        $autoCell.addClass('black');
        $autoCell.data('player', 'black');
        if(that.isWinner($autoCell))
        {
          that.isGameOver = true;
          $('.col.empty').removeClass('empty');
          $("#divMessage").text(`You! Player ${that.player} has won!`);

          return;
        }
      }else{
        that.player = (that.player === 'white') ? 'black' : 'white';
      }
      
      that.onPlayerMove();
      $(this).trigger('mouseenter');
    });
  }
                                                          // this version of the method accepts 2 arguments.  One for column and one for row.
  findLastEmptyCell2(col, row) {
    const cells = $(`.col[data-col='${col}']`);
  
      const $cell = $(cells[row]);
      if ($cell.hasClass('empty')) {
        return $cell;
      }
    
    return null;
  }
                                                          // checks to see if there is a winner and returns the winner.
  isWinner(cell)
  {
    const winner = this.checkForWinner(
      cell.data('row'), 
      cell.data('col')
    )
    return winner;
  }
                                                          // this is artificial intelligence or computer. 
  autoPlay() 
  {
    for (var i = 0;i<10;++i)
    {
      var row =Math.floor(Math.random() * (+this.ROWS - 0)) + 0; 
      var col =Math.floor(Math.random() * (+this.COLS - 0)) + 0;
      const $lastEmptyCell = this.findLastEmptyCell2(col,row);
      if ($lastEmptyCell!=null) return $lastEmptyCell;
    }
    return null;
  }
  checkForWinner(row, col) {                             // checks for winner
    const that = this;

    function $getCell(i, j) {
      return $(`.col[data-row='${i}'][data-col='${j}']`);
    }

    function checkDirection(direction) {               // checks for direction           
      let total = 0;
      let i = row + direction.i;
      let j = col + direction.j;
console.log("check: row: "+i+", col: "+j);
      let $next = $getCell(i, j);                     
      while (i >= 0 &&
        i < that.ROWS &&
        j >= 0 &&
        j < that.COLS && 
        $next.data('player') === that.player
      ) {
        total++;
        i += direction.i;
        j += direction.j;
       //console.log(j+" "+i);
        $next = $getCell(i, j);
      }
      console.log("Total: "+total);
      return total;
    }

    function checkWin(directionA, directionB) {       // checks for winner
      var total= checkDirection(directionA) +
        checkDirection(directionB);

      if (total >= 4) {
        return that.player;
      } else {
        return null;
      }
    }
    var message="";
    function checkDiagonalBLtoTR() {
      console.log("diag");
      
      return checkWin({i: -1, j: -1}, {i: 1, j: 1});
    }

    function checkDiagonalTLtoBR() {
      //alert("diag-2");
      console.log("start checkDiagonalTLtoBR");

      return checkWin({i: 1, j: -1}, {i: -1, j: 1});
    }

    function checkVerticals() {
      console.log("start checkVerticals");
      return checkWin({i: -1, j: 0}, {i: 1, j: 0});
    }

    function checkHorizontals() {
      console.log("start checkHoriz");
      return checkWin({i: 0, j: -1}, {i: 0, j: 1});
    }

    var win= checkVerticals() || 
      checkHorizontals() || 
      checkDiagonalBLtoTR() ||
      checkDiagonalTLtoBR();
    return win;

  }
  help()                                                    
  {

  }
  restart () {
    this.createGrid();
    this.onPlayerMove();
  }
}

