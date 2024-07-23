

import { Auth } from "../auth";
import { Router } from "../router";

export class OfflinePage {
  static async load(): Promise<string> {
    if (!Auth.isLoggedIn()) {
      window.location.hash = "#/login";
      Router.loadContent();
      return "";
    }
    const response = await fetch("src/views/offline.html");
    return response.text();
   
  }

  static initEventListeners() {
    

    var board,
    game = new Chess();
    class Modal {
    constructor() {
        this.modalElement = document.createElement('div');
        this.modalElement.classList.add('modal');
        this.modalElement.innerHTML = `
            <div class="modal-content">
                <p id="modalMessage"></p>
                <div id="modalButtons"></div>
            </div>
        `;
        document.body.appendChild(this.modalElement);
        this.messageElement = this.modalElement.querySelector('#modalMessage');
        this.buttonsElement = this.modalElement.querySelector('#modalButtons');
    }

    show(message, buttons = []) {
        this.messageElement.innerText = message;
        this.buttonsElement.innerHTML = '';
        buttons.forEach(button => {
            const buttonElement = document.createElement('button');
            buttonElement.innerText = button.text;
            buttonElement.onclick = button.onClick;
            this.buttonsElement.appendChild(buttonElement);
        });
        this.modalElement.style.display = 'block';
    }

    hide() {
        this.modalElement.style.display = 'none';
    }
}

// Initialize the modal
const modal = new Modal();


class TableModal {
    constructor(modalId) {
        this.modalElement = document.getElementById(modalId);
        this.closeButton = this.modalElement.querySelector('.modal-close');
        this.tableBody = this.modalElement.querySelector('#move-history-table tbody');

        // Bind event listeners
        this.bindEvents();
    }

    bindEvents() {
        // Close the modal when the close button is clicked
        this.closeButton.addEventListener('click', () => this.hide());

        // Close the modal when clicking outside the modal content
        window.addEventListener('click', (event) => {
            if (event.target === this.modalElement) {
                this.hide();
            }
        });
    }

    show(moves = []) {
        // Clear previous content
        this.tableBody.innerHTML = '';

        // Populate table with new data
        for (let i = 0; i < moves.length; i += 2) {
            const playerMove = moves[i] || '';
            const computerMove = moves[i + 1] || '';
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${playerMove}</td>
                <td>${computerMove}</td>
            `;
            this.tableBody.appendChild(row);
        }

        // Show the modal
        this.modalElement.style.display = 'block';
    }

    hide() {
        // Hide the modal
        this.modalElement.style.display = 'none';
    }
}

// Initialize the modal
const tableModal = new TableModal('tableModal');

// Example function to open modal with table data
function openModalWithMoveHistory(moves) {
    tableModal.show(moves);
}

// Add event listener to a button or trigger
document.getElementById('openModalButton').addEventListener('click', () => {
    openModalWithMoveHistory(game.history());
});

// Show the level selection modal on page load

    modal.show('Choose your level:', [
        { text: 'Easy', onClick: () => startGame(1) },
        { text: 'Medium', onClick: () => startGame(2) },
        { text: 'Hard', onClick: () => startGame(3) }
    ]);


// Function to start the game with the selected level
function startGame(level) {
    modal.hide();
    const depth = level === 1 ? 1 : level === 2 ? 2 : 3;
    const searchDepthSelect = document.getElementById('search-depth');
    searchDepthSelect.value = depth;
    searchDepthSelect.disabled = true;
    modal.show("YOU MAKE THE FIRST MOVE", []);
    setTimeout(() => {
        modal.hide();
    }, 2000);
}

var updateStatus = function () {
    let status = '';
    console.log("Show");
    
    if (game.in_checkmate()) {
      
        status = 'Checkmate! ' + (game.turn() === 'w' ? 'Black' : 'White') + ' wins.'; 
        modal.show(status, []);
    } else if (game.in_draw()) {
        status = 'Draw!';
    } else {
        
    
        status = "AI IS THINKING";    
        game.turn() === 'b' ?  modal.show(status, []) : null;
        if (game.in_check()) {
            status = 'Check Mate!';
            modal.show(status, []);
        }
    }

    
    
   
    setTimeout(() => {
        modal.hide();
    }, 2000);
};




/*The "AI" part starts here */

var minimaxRoot =function(depth, game, isMaximisingPlayer) {

    var newGameMoves = game.moves();
    var bestMove = -9999;
    var bestMoveFound;

    for(var i = 0; i < newGameMoves.length; i++) {
        var newGameMove = newGameMoves[i]
        game.move(newGameMove);
        var value = minimax(depth - 1, game, -10000, 10000, !isMaximisingPlayer);
        game.undo();
        if(value >= bestMove) {
            bestMove = value;
            bestMoveFound = newGameMove;
        }
    }
    return bestMoveFound;
};

var minimax = function (depth, game, alpha, beta, isMaximisingPlayer) {
    positionCount++;
    if (depth === 0) {
        return -evaluateBoard(game.board());
    }

    var newGameMoves = game.moves();

    if (isMaximisingPlayer) {
        var bestMove = -9999;
        for (var i = 0; i < newGameMoves.length; i++) {
            game.move(newGameMoves[i]);
            bestMove = Math.max(bestMove, minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer));
            game.undo();
            alpha = Math.max(alpha, bestMove);
            if (beta <= alpha) {
                return bestMove;
            }
        }
        return bestMove;
    } else {
        var bestMove = 9999;
        for (var i = 0; i < newGameMoves.length; i++) {
            game.move(newGameMoves[i]);
            bestMove = Math.min(bestMove, minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer));
            game.undo();
            beta = Math.min(beta, bestMove);
            if (beta <= alpha) {
                return bestMove;
            }
        }
        return bestMove;
    }
};

var evaluateBoard = function (board) {
    var totalEvaluation = 0;
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            totalEvaluation = totalEvaluation + getPieceValue(board[i][j], i ,j);
        }
    }
    return totalEvaluation;
};

var reverseArray = function(array) {
    return array.slice().reverse();
};

var pawnEvalWhite =
    [
        [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
        [5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0],
        [1.0,  1.0,  2.0,  3.0,  3.0,  2.0,  1.0,  1.0],
        [0.5,  0.5,  1.0,  2.5,  2.5,  1.0,  0.5,  0.5],
        [0.0,  0.0,  0.0,  2.0,  2.0,  0.0,  0.0,  0.0],
        [0.5, -0.5, -1.0,  0.0,  0.0, -1.0, -0.5,  0.5],
        [0.5,  1.0, 1.0,  -2.0, -2.0,  1.0,  1.0,  0.5],
        [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0]
    ];

var pawnEvalBlack = reverseArray(pawnEvalWhite);

var knightEval =
    [
        [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
        [-4.0, -2.0,  0.0,  0.0,  0.0,  0.0, -2.0, -4.0],
        [-3.0,  0.0,  1.0,  1.5,  1.5,  1.0,  0.0, -3.0],
        [-3.0,  0.5,  1.5,  2.0,  2.0,  1.5,  0.5, -3.0],
        [-3.0,  0.0,  1.5,  2.0,  2.0,  1.5,  0.0, -3.0],
        [-3.0,  0.5,  1.0,  1.5,  1.5,  1.0,  0.5, -3.0],
        [-4.0, -2.0,  0.0,  0.5,  0.5,  0.0, -2.0, -4.0],
        [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0]
    ];

var bishopEvalWhite = [
    [ -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
    [ -1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
    [ -1.0,  0.0,  0.5,  1.0,  1.0,  0.5,  0.0, -1.0],
    [ -1.0,  0.5,  0.5,  1.0,  1.0,  0.5,  0.5, -1.0],
    [ -1.0,  0.0,  1.0,  1.0,  1.0,  1.0,  0.0, -1.0],
    [ -1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0, -1.0],
    [ -1.0,  0.5,  0.0,  0.0,  0.0,  0.0,  0.5, -1.0],
    [ -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0]
];

var bishopEvalBlack = reverseArray(bishopEvalWhite);

var rookEvalWhite = [
    [  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
    [  0.5,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [  0.0,   0.0, 0.0,  0.5,  0.5,  0.0,  0.0,  0.0]
];

var rookEvalBlack = reverseArray(rookEvalWhite);

var evalQueen =
    [
    [ -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
    [ -1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
    [ -1.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
    [ -0.5,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
    [  0.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
    [ -1.0,  0.5,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
    [ -1.0,  0.0,  0.5,  0.0,  0.0,  0.0,  0.0, -1.0],
    [ -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0]
];

var kingEvalWhite = [

    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
    [ -1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
    [  2.0,  2.0,  0.0,  0.0,  0.0,  0.0,  2.0,  2.0 ],
    [  2.0,  3.0,  1.0,  0.0,  0.0,  1.0,  3.0,  2.0 ]
];

var kingEvalBlack = reverseArray(kingEvalWhite);




var getPieceValue = function (piece, x, y) {
    if (piece === null) {
        return 0;
    }
    var getAbsoluteValue = function (piece, isWhite, x ,y) {
        if (piece.type === 'p') {
            return 10 + ( isWhite ? pawnEvalWhite[y][x] : pawnEvalBlack[y][x] );
        } else if (piece.type === 'r') {
            return 50 + ( isWhite ? rookEvalWhite[y][x] : rookEvalBlack[y][x] );
        } else if (piece.type === 'n') {
            return 30 + knightEval[y][x];
        } else if (piece.type === 'b') {
            return 30 + ( isWhite ? bishopEvalWhite[y][x] : bishopEvalBlack[y][x] );
        } else if (piece.type === 'q') {
            return 90 + evalQueen[y][x];
        } else if (piece.type === 'k') {
            return 900 + ( isWhite ? kingEvalWhite[y][x] : kingEvalBlack[y][x] );
        }
        throw "Unknown piece type: " + piece.type;
    };

    var absoluteValue = getAbsoluteValue(piece, piece.color === 'w', x ,y);
    return piece.color === 'w' ? absoluteValue : -absoluteValue;
};


/* board visualization and games state handling */

var onDragStart = function (source, piece, position, orientation) {
    if (game.in_checkmate() === true || game.in_draw() === true ||
        piece.search(/^b/) !== -1) {
        return false;
    }
};

var makeBestMove = function () {
    var bestMove = getBestMove(game);
    game.move(bestMove);
    board.position(game.fen());
    setTimeout(updateStatus,800)

    if (game.game_over()) {
        alert('Game over');
    }
};


var positionCount;
var getBestMove = function (game) {
    if (game.game_over()) {
        modal.show('Game over', []);
        return;
    }

    positionCount = 0;
    var depth = parseInt($('#search-depth').find(':selected').text());

    var d = new Date().getTime();
    var bestMove = minimaxRoot(depth, game, true);
    var d2 = new Date().getTime();
    var moveTime = (d2 - d);
    var positionsPerS = ( positionCount * 1000 / moveTime);

    $('#position-count').text(positionCount);
    $('#time').text(moveTime/1000 + 's');
    $('#positions-per-s').text(positionsPerS);
    return bestMove;
};



var onDrop = function (source, target) {

    var move = game.move({
        from: source,
        to: target,
        promotion: 'q'
    });

    removeGreySquares();
    if (move === null) {
        return 'snapback';
    }
    
    window.setTimeout(makeBestMove, 250);
};

var onSnapEnd = function () {
    board.position(game.fen());
    updateStatus()
    
    
};

var onMouseoverSquare = function(square, piece) {
    var moves = game.moves({
        square: square,
        verbose: true
    });

    if (moves.length === 0) return;

    greySquare(square);

    for (var i = 0; i < moves.length; i++) {
        greySquare(moves[i].to);
    }
};

var onMouseoutSquare = function(square, piece) {
    removeGreySquares();
};

var removeGreySquares = function() {
    $('#board .square-55d63').css('background', '');
};

var greySquare = function(square) {
    var squareEl = $('#board .square-' + square);

    var background = '#a9a9a9';
    if (squareEl.hasClass('black-3c85d') === true) {
        background = '#696969';
    }

    squareEl.css('background', background);
};

var cfg = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onMouseoutSquare: onMouseoutSquare,
    onMouseoverSquare: onMouseoverSquare,
    onSnapEnd: onSnapEnd
};
// Pause functionality
document.getElementById('pauseBtn').addEventListener('click', () => {
    // Implement pause logic here
    modal.show('Game paused.', [
        { text: 'Resume', onClick: () => resumeGame() },
        { text: 'Abort', onClick: () => abortGame() }
    ]);
});

// Restart functionality
document.getElementById('restartBtn').addEventListener('click', () => {
    game = new Chess();
    board.position('start');
    updateStatus();

});

// Abort functionality
document.getElementById('abortBtn').addEventListener('click', () => {
    // Implement abort logic here
    modal.show('ARE YOU SURE?', [
        { text: 'CONFIRM ABORT', onClick: () => abortGame() },
        { text: 'BACK TO GAME', onClick: () => modal.hide() }
    ]);
});

function resumeGame() {
    modal.hide();
    // Add logic to resume the game
}

function abortGame() {
    modal.hide();
    window.location.hash="#/welcome"
}

board = ChessBoard('board', cfg);
    
    
  }
}
