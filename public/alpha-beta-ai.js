var NUMBER_OF_ROUNDS = 6;

function getNaiveScore(board, player) {
  if (board.gameOver)
    return board.player === player ? 20 : -20;

  var me = 0;
  var thatGuy = 0;
  
  for (var i = 0; i < 8; i += 1) {
    for (var j = 0; j < 8; j += 1) {
      if (board.board[i][j] === player) {
        me += 1;

        if (board.crowned[i][j])
          me += 0.5;
      } else if (board.board[i][j] !== 0) {
        thatGuy += 1;

        if (board.crowned[i][j])
          thatGuy += 0.5;
      }
    }
  }

  if (board.isJumpPossible())
    board.player === player ? me++ : thatGuy++;

  return me / thatGuy;
}

function getScore(board, player, remainingRounds, ALPHA, BETA) {
  if (board.gameOver || remainingRounds === 0)
    return getNaiveScore(board, player);

  var score = board.player === player ? -Infinity : Infinity;
  board.getMoveList().forEach(move => {
    var clone = new CheckerBoard(board);
    clone.makeMove(move);

    if (board.player === player) {
      score = Math.max(getScore(clone, player, remainingRounds - 1, ALPHA, BETA), score);
      ALPHA = Math.max(ALPHA, score);
    }else{
      score = Math.min(getScore(clone, player, remainingRounds - 1, ALPHA, BETA), score);
      BETA = Math.min(BETA, score);
    }

    if(ALPHA >= BETA || score * board.player == 20) return score;
  });

  return score;
}

function GetMove(board) {
  ALPHA = -Infinity
  BETA = Infinity
  var start = Date.now();
  var moveList = board.getMoveList();

  if (moveList.length === 1)
    return moveList[0];

  var highScore = -Infinity;
  var highMove = 0;

  moveList.forEach(move => {
    var clone = new CheckerBoard(board);
    clone.makeMove(move);
    var score = getScore(clone, board.player, NUMBER_OF_ROUNDS, ALPHA, BETA);
    ALPHA = Math.max(ALPHA, score)
    console.log(move.startX.toString() + ":" + move.startY.toString() + " -> " + move.endX.toString() + ":" + move.endY.toString() + " Score: " + score.toString());

    if (score > highScore) {
      highScore = score;
      highMove = move;
    }
  });

  console.log("\nMove chosen: " + highMove.startX.toString() + ":" + highMove.startY.toString() + " -> " + highMove.endX.toString() + ":" + highMove.endY.toString() + " Score: " + highScore.toString());

  var time = Date.now() - start;

  if(time < 1000){
    NUMBER_OF_ROUNDS++;
    console.log("NUMBER_OF_ROUNDS dynamically raised to " + NUMBER_OF_ROUNDS);
  }else if(time > 3000){
    NUMBER_OF_ROUNDS--;
    console.log("NUMBER_OF_ROUNDS dynamically lowered to " + NUMBER_OF_ROUNDS);
  }
  return highMove;
}
