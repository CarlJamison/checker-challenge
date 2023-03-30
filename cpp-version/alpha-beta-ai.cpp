#include <algorithm>
#include "checkers.h"
#include <cstdio>
#include <string> 

double getNaiveScore(CheckerBoard board, int player) {
  if (board.gameOver)
    return board.player == player ? 20.0 : -20.0;

  double me = 0;
  double thatGuy = 0;
  
  for (int i = 0; i < 8; i++) {
    for (int j = 0; j < 8; j++) {
      if (board.board[i][j] == player) {
        me += 1.0;

        if (board.crowned[i][j])
          me += 0.5;
      } else if (board.board[i][j] != 0) {
        thatGuy += 1.0;

        if (board.crowned[i][j])
          thatGuy += 0.5;
      }
    }
  }

  if (board.isJumpPossible())
    board.player == player ? me++ : thatGuy++;

  return me / thatGuy;
}

double getScore(CheckerBoard board, int player, int remainingRounds, double ALPHA, double BETA) {
  if (board.gameOver || remainingRounds == 0)
    return getNaiveScore(board, player);

  board.getMoveList();  
  double score = board.player == player ? -100 : 100;
  for(int i = 0; i < board.moveCount; i++){
    CheckerBoard clone = CheckerBoard(board);
    clone.makeMove(board.moveList[i]);

    if (board.player == player) {
      score = std::max(getScore(clone, player, remainingRounds - 1, ALPHA, BETA), score);
      ALPHA = std::max(ALPHA, score);
    }else{
      score = std::min(getScore(clone, player, remainingRounds - 1, ALPHA, BETA), score);
      BETA = std::min(BETA, score);
    }

    //Either this move is extremely unlikely, or it's a guaranteed win/loss
    if(ALPHA >= BETA || score * board.player == 20) return score;
  }

  return score;
}

Move GetMove(CheckerBoard board, int NUMBER_OF_ROUNDS) {
  double ALPHA = -100;
  double BETA = 100;
  board.getMoveList();

  if (board.moveCount == 1)
    return board.moveList[0];

  double highScore = -100;
  Move highMove;

  for(int i = 0; i < board.moveCount; i++){
    Move move = board.moveList[i];
    CheckerBoard clone = CheckerBoard(board);
    clone.makeMove(move);
    double score = getScore(clone, board.player, NUMBER_OF_ROUNDS, ALPHA, BETA);
    ALPHA = std::max(ALPHA, score);

    if (score > highScore) {
      highScore = score;
      highMove = move;
    }
  }

  return highMove;
}

int main(int argc, char* argv[])
{
    printf("You have entered %d arguments:\n", argc);
 
    for (int i = 0; i < argc; i++) {
        printf("%s\n", argv[i]);
    }

    int boardArray[65];
    for(int i = 0; i < 65; i++){
        boardArray[i] = int(argv[1][i]) - 48;
    }

    GetMove(boardArray, 5);
    return 0;
}
