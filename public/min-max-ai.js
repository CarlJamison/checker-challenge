const NUMBER_OF_ROUNDS = 5;

function getNaiveScore(board, player) {
  var runningScore;

  if (board.gameOver) {
    return board.player === player ? 1001 : -1001;
  }

  runningScore = 0;

  for (var i = 0; i < 8; i += 1) {
    for (var j = 0; j < 8; j += 1) {
      if (board.board[i][j] === player) {
        runningScore += 6;

        if (board.crowned[i][j]) {
          runningScore += 4;
        }
      } else {
        if (board.board[i][j] !== 0) {
          runningScore -= 6;

          if (board.crowned[i][j]) {
            runningScore -= 4;
          }
        }
      }
    }
  }

  if (board.isJumpPossible()) {
    runningScore += board.player === player ? 10 : -10;
  }

  return runningScore;
}

function getScoreRec(board, player, remainingRounds) {
  var clone, first, localScore, moveList, score;

  if (board.gameOver || remainingRounds === 0) {
    return getNaiveScore(board, player);
  }

  score = 0;
  moveList = board.getMoveList();
  first = true;

  if (board.player === player) {
    moveList.forEach(move => {
      clone = new CheckerBoard(board);
      clone.makeMove(move);
      localScore = getScoreRec(clone, player, remainingRounds - 1);

      if (localScore > 1000) {
        return localScore;
      }

      if (localScore > score || first) {
        score = localScore;
        first = false;
      }
    });

    return score;
  } else {
    moveList.forEach(move => {
      clone = new CheckerBoard(board);
      clone.makeMove(move);
      localScore = getScoreRec(clone, player, remainingRounds - 1);

      if (localScore < score || first) {
        score = localScore;
        first = false;
      }
    });

    return score;
  }
}

function getScore(board, player) {
  return getScoreRec(board, player, NUMBER_OF_ROUNDS);
}

function GetMove(board) {
  var clone, highMove, highScore, moveList, score;
  moveList = board.getMoveList();

  if (moveList.length === 1) {
    return moveList[0];
  }

  highScore = 0;
  highMove = 0;

  moveList.forEach(move => {
    clone = new CheckerBoard(board);
    clone.makeMove(move);
    score = getScore(clone, board.player);
    console.log(move.startX.toString() + ":" + move.startY.toString() + " -> " + move.endX.toString() + ":" + move.endY.toString() + " Score: " + score.toString());

    if (score > highScore || highMove === 0) {
      highScore = score;
      highMove = move;
    }
  });

  console.log("\nMove chosen: " + highMove.startX.toString() + ":" + highMove.startY.toString() + " -> " + highMove.endX.toString() + ":" + highMove.endY.toString() + " Score: " + highScore.toString());
  return highMove;
}
