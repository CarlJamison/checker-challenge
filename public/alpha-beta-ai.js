var NUMBER_OF_ROUNDS = 6;

function getNaiveScore(board, player) {
  if (board.gameOver) {
    return board.player === player ? 10 : -10;
  }

  var me = 0;
  var thatGuy = 0;
  
  for (var i = 0; i < 8; i += 1) {
    for (var j = 0; j < 8; j += 1) {
      if (board.board[i][j] === player) {
        me += 1;

        if (board.crowned[i][j]) {
          me += 0.5;
        }
      } else {
        if (board.board[i][j] !== 0) {
          thatGuy += 1;

          if (board.crowned[i][j]) {
            thatGuy += 0.5;
          }
        }
      }
    }
  }

  if (board.isJumpPossible()) {
    board.player === player ? me++ : thatGuy++;
  }

  return me / thatGuy;
}

function getScoreRec(board, player, remainingRounds, ALPHA, BETA) {
  var clone, localScore, moveList, score;

  if (board.gameOver || remainingRounds === 0) {
    return getNaiveScore(board, player);
  }

  moveList = board.getMoveList();

  if (board.player === player) {
    score = -Infinity;
    moveList.forEach(move => {
      clone = new CheckerBoard(board);
      clone.makeMove(move);
      score = Math.max(getScoreRec(clone, player, remainingRounds - 1, ALPHA, BETA), score);

      if(score >= BETA) return score;
      ALPHA = Math.max(ALPHA, score)
      if(score == 10) return score
    });

    return score;
  } else {
    score = Infinity;
    moveList.forEach(move => {
      clone = new CheckerBoard(board);
      clone.makeMove(move);
      score = Math.min(getScoreRec(clone, player, remainingRounds - 1, ALPHA, BETA), score);

      if(score <= ALPHA) return score
      BETA = Math.min(BETA, score)
      if(score == -1000) return score
    });

    return score;
  }
}

function getScore(board, player, ALPHA, BETA) {
  return getScoreRec(board, player, NUMBER_OF_ROUNDS, ALPHA, BETA);
}

function GetMove(board) {
  ALPHA = -Infinity
  BETA = Infinity
  var start = Date.now();
  var clone, highMove, highScore, moveList, score;
  moveList = board.getMoveList();

  if (moveList.length === 1) {
    return moveList[0];
  }

  highScore = -Infinity;
  highMove = 0;

  moveList.forEach(move => {
    clone = new CheckerBoard(board);
    clone.makeMove(move);
    score = getScore(clone, board.player, ALPHA, BETA);
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
