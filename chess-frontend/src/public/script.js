var moveHistory = [];

var board,
  game = new Chess();

var capturedPieces = {
  player: [],
  computer: [],
};

function displayCapturedPiece(piece) {
  let outpiece;
  console.log(game.turn());
  if (game.turn() === "b") {
    outpiece = "b";
    apppendCapturedPiece(
      document.getElementById("captured-list-for-white"),
      outpiece
    );
  } else {
    outpiece = "w";
    apppendCapturedPiece(
      document.getElementById("captured-list-for-black"),
      outpiece
    );
  }

  function apppendCapturedPiece(capturedList, outpiece) {
    outpiece = outpiece + piece.type.toUpperCase();

    let img = document.createElement("img");

    let pieceTheme = document.getElementById("piece-theme").value.split("_")[0];

    img.src = chsspieces[pieceTheme][outpiece];

    img.alt = piece.color + " " + piece.type;

    img.width = 45;
    img.height = 45;

    capturedList.appendChild(img);
  }
}

var minimaxRoot = function (depth, game, isMaximisingPlayer) {
  var newGameMoves = game.moves();
  var bestMove = -9999;
  var bestMoveFound;

  for (var i = 0; i < newGameMoves.length; i++) {
    var newGameMove = newGameMoves[i];
    game.move(newGameMove);
    var value = minimax(depth - 1, game, -10000, 10000, !isMaximisingPlayer);
    game.undo();
    if (value >= bestMove) {
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
      bestMove = Math.max(
        bestMove,
        minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer)
      );
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
      bestMove = Math.min(
        bestMove,
        minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer)
      );
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
      totalEvaluation = totalEvaluation + getPieceValue(board[i][j], i, j);
    }
  }
  return totalEvaluation;
};

var reverseArray = function (array) {
  return array.slice().reverse();
};

var pawnEvalWhite = [
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0],
  [1.0, 1.0, 2.0, 3.0, 3.0, 2.0, 1.0, 1.0],
  [0.5, 0.5, 1.0, 2.5, 2.5, 1.0, 0.5, 0.5],
  [0.0, 0.0, 0.0, 2.0, 2.0, 0.0, 0.0, 0.0],
  [0.5, -0.5, -1.0, 0.0, 0.0, -1.0, -0.5, 0.5],
  [0.5, 1.0, 1.0, -2.0, -2.0, 1.0, 1.0, 0.5],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
];

var pawnEvalBlack = reverseArray(pawnEvalWhite);

var knightEval = [
  [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
  [-4.0, -2.0, 0.0, 0.0, 0.0, 0.0, -2.0, -4.0],
  [-3.0, 0.0, 1.0, 1.5, 1.5, 1.0, 0.0, -3.0],
  [-3.0, 0.5, 1.5, 2.0, 2.0, 1.5, 0.5, -3.0],
  [-3.0, 0.0, 1.5, 2.0, 2.0, 1.5, 0.0, -3.0],
  [-3.0, 0.5, 1.0, 1.5, 1.5, 1.0, 0.5, -3.0],
  [-4.0, -2.0, 0.0, 0.5, 0.5, 0.0, -2.0, -4.0],
  [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
];

var bishopEvalWhite = [
  [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
  [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
  [-1.0, 0.0, 0.5, 1.0, 1.0, 0.5, 0.0, -1.0],
  [-1.0, 0.5, 0.5, 1.0, 1.0, 0.5, 0.5, -1.0],
  [-1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, -1.0],
  [-1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0],
  [-1.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5, -1.0],
  [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
];

var bishopEvalBlack = reverseArray(bishopEvalWhite);

var rookEvalWhite = [
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.5, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5],
  [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
  [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
  [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
  [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
  [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
  [0.0, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0],
];

var rookEvalBlack = reverseArray(rookEvalWhite);

var evalQueen = [
  [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
  [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
  [-1.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
  [-0.5, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
  [0.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
  [-1.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
  [-1.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, -1.0],
  [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
];

var kingEvalWhite = [
  [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [-2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
  [-1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
  [2.0, 2.0, 0.0, 0.0, 0.0, 0.0, 2.0, 2.0],
  [2.0, 3.0, 1.0, 0.0, 0.0, 1.0, 3.0, 2.0],
];

var kingEvalBlack = reverseArray(kingEvalWhite);

var getPieceValue = function (piece, x, y) {
  if (piece === null) {
    return 0;
  }
  var getAbsoluteValue = function (piece, isWhite, x, y) {
    if (piece.type === "p") {
      return 10 + (isWhite ? pawnEvalWhite[y][x] : pawnEvalBlack[y][x]);
    } else if (piece.type === "r") {
      return 50 + (isWhite ? rookEvalWhite[y][x] : rookEvalBlack[y][x]);
    } else if (piece.type === "n") {
      return 30 + knightEval[y][x];
    } else if (piece.type === "b") {
      return 30 + (isWhite ? bishopEvalWhite[y][x] : bishopEvalBlack[y][x]);
    } else if (piece.type === "q") {
      return 90 + evalQueen[y][x];
    } else if (piece.type === "k") {
      return 900 + (isWhite ? kingEvalWhite[y][x] : kingEvalBlack[y][x]);
    }
    throw "Unknown piece type: " + piece.type;
  };

  var absoluteValue = getAbsoluteValue(piece, piece.color === "w", x, y);
  return piece.color === "w" ? absoluteValue : -absoluteValue;
};

/* board visualization and games state handling */

var onDragStart = function (source, piece, position, orientation) {
  if (game.in_checkmate() === true) {
    $("#status").text("Checkmate");
    return false;
  } else if (
    game.in_draw() === true ||
    game.in_stalemate() === true ||
    game.in_threefold_repetition() === true ||
    game.insufficient_material() === true ||
    piece.search(/^b/) !== -1
  ) {
    $("#status").text("Game Over");
    return false;
  }
};

var makeBestMove = function () {
  var bestMove = getBestMove(game);
  var move = game.move(bestMove);

  if (move === null) {
    console.log("Invalid move: " + bestMove);
    return "snapback"; // Inform the user to try a different move
  }

  game.move(bestMove);
  board.position(game.fen());
  renderMoveHistory(game.history());
  updateStatus();
  console.log(bestMove);
  if (move.captured) {
    var capturedPiece = {
      type: move.captured[0],
      color: move.captured[1],
    };
    displayCapturedPiece(capturedPiece, game.turn());
  }

  if (game.in_checkmate()) {
    $("#status").text("Checkmate");
  } else if (game.in_draw()) {
    $("#status").text("Draw");
  } else if (game.in_stalemate()) {
    $("#status").text("Stalemate");
  } else if (game.in_threefold_repetition()) {
    $("#status").text("Threefold Repetition");
  } else if (game.insufficient_material()) {
    $("#status").text("Insufficient Material");
  }

  if (game.game_over()) {
    alert("Game over");
  }
};

var positionCount;
var getBestMove = function (game) {
  if (game.game_over()) {
    alert("Game over");
  }

  positionCount = 0;
  var depth = parseInt($("#search-depth").find(":selected").val());

  var d = new Date().getTime();
  var bestMove = minimaxRoot(depth, game, true);
  var d2 = new Date().getTime();
  var moveTime = d2 - d;
  var positionsPerS = (positionCount * 1000) / moveTime;

  $("#position-count").text(positionCount);
  $("#time").text(moveTime / 1000 + "s");
  $("#positions-per-s").text(positionsPerS);

  return bestMove;
};

var renderMoveHistory = function (moves) {
  console.log(moves);
  var playerMovesContainer = $(".actual-move-player");
  var computerMovesContainer = $(".actual-move-computer");

  playerMovesContainer.empty();
  computerMovesContainer.empty();

  for (var i = 0; i < moves.length; i++) {
    var move = moves[i] ? moves[i] : " ";
    var moveElement = $('<div class="move-row">' + move + "</div>");

    if (i % 2 === 0) {
      playerMovesContainer.append(moveElement);
    } else {
      computerMovesContainer.append(moveElement);
    }
  }
};

var onDrop = function (source, target) {
  var move = game.move({
    from: source,
    to: target,
    promotion: "q",
  });

  if (move === null) {
    return "snapback";
  }

  if (move.captured) {
    console.log(move);
    var capturedPiece = {
      type: move.captured[0],
      color: move.captured[1],
    };
    displayCapturedPiece(capturedPiece, game.turn());
  }

  setTimeout(function () {
    makeBestMove();
  }, 250);

  renderMoveHistory(game.history());
};

var onSnapEnd = function () {
  board.position(game.fen());
  updateStatus();
};

var onMouseoverSquare = function (square, piece) {
  var moves = game.moves({
    square: square,
    verbose: true,
  });

  if (moves.length === 0) return;

  greySquare(square);

  for (var i = 0; i < moves.length; i++) {
    greySquare(moves[i].to);
  }
};

var onMouseoutSquare = function (square, piece) {
  removeGreySquares();
};

var removeGreySquares = function () {
  $("#board .square-55d63").each(function () {
    var square = $(this);
    var backgroundColor = square.css("background-color");

    if (
      backgroundColor === "rgb(169, 169, 169)" ||
      backgroundColor === "rgb(105, 105, 105)"
    ) {
      var squareId = square.attr("data-square");
      var isLightSquare =
        (squareId.charCodeAt(0) + parseInt(squareId.charAt(1))) % 2 === 0;
      square.css(
        "background",
        isLightSquare ? cfg.boardTheme[1] : cfg.boardTheme[0]
      );
    }
  });
};

var greySquare = function (square) {
  var squareEl = $("#board .square-" + square);
  var background = "#a9a9a9";
  if (squareEl.hasClass("black-3c85d") === true) {
    background = "#696969";
  }

  squareEl.css("background", background);
};

var cfg = {
  pieceTheme: metro_piece_theme,
  boardTheme: symbol_board_theme,
  draggable: true,
  position: "start",
  onDragStart: onDragStart,
  onDrop: onDrop,
  onMouseoutSquare: onMouseoutSquare,
  onMouseoverSquare: onMouseoverSquare,
  onSnapEnd: onSnapEnd,
};
var updateStatus = function () {
  var status = "";

  var moveColor = "White";
  if (game.turn() === "b") {
    moveColor = "Black";
  }

  if (game.in_checkmate()) {
    status = "Checkmate";
  } else if (game.in_draw()) {
    console.log("Hey");
    status = "Draw";
  } else {
    status = moveColor + "'s turn";
    if (game.in_check()) {
      status += " - Check";
    }
  }

  $("#status").text(status);
  if (moveColor === "White") {
    $("#turn-status").text("Make Your Move");
  } else {
    $("#turn-status").text("Computer is thinking");

    // Start decrementing computer timer
  }
};

updateStatus();
board = ChessBoard("board", cfg);

$("#piece-theme").on("change", function () {
  var selectedTheme = $(this).val();
  cfg.pieceTheme = window[selectedTheme];

  var currentFen = game.fen();

  board.destroy();
  board = ChessBoard("board", cfg);

  board.position(game.fen());
  updateCapturedPiecesTheme();
});

$("#board-theme").on("change", function () {
  var selectedTheme = $(this).val();

  cfg.boardTheme = window[selectedTheme]; // Assign the selected theme dynamically

  var currentFen = game.fen();

  board.destroy();

  board = ChessBoard("board", cfg);

  board.position(game.fen());
});
function updateCapturedPiecesTheme() {
  var pieceTheme = $("#piece-theme").val().split("_")[0];
  console.log("Theme:", pieceTheme);

  let whiteDivs = Array.from(
    document.getElementsByClassName("captured-list-for-white")
  );
  whiteDivs.forEach((div) => {
    let images = Array.from(div.getElementsByTagName("img"));
    images.forEach((img) => {
      console.log(img);

      let pieceColor = "b";
      let pieceType = img.alt[img.alt.length - 1].toUpperCase();

      console.log("White:", pieceType + pieceColor);

      if (
        chsspieces &&
        chsspieces[pieceTheme] &&
        chsspieces[pieceTheme][pieceColor + pieceType]
      ) {
        $(img).attr("src", chsspieces[pieceTheme][pieceColor + pieceType]);
      } else {
        console.log(
          "White: The piece source is not available in the `chsspieces` object."
        );
      }
    });
  });

  let blackDivs = Array.from(
    document.getElementsByClassName("captured-list-for-black")
  );
  blackDivs.forEach((div) => {
    let images = Array.from(div.getElementsByTagName("img"));
    images.forEach((img) => {
      console.log(img);

      let pieceColor = "w";
      let pieceType = img.alt[img.alt.length - 1].toUpperCase();

      console.log("Black:", pieceType + pieceColor);

      if (
        chsspieces &&
        chsspieces[pieceTheme] &&
        chsspieces[pieceTheme][pieceColor + pieceType]
      ) {
        $(img).attr("src", chsspieces[pieceTheme][pieceColor + pieceType]);
      } else {
        console.log(
          "Black: The piece source is not available in the `chsspieces` object."
        );
      }
    });
  });
}
