#ifndef CHECKERS 
#define CHECKERS

#include <cstdlib>
#include <cstring>

class Move {
    public:
        int startX;
        int startY;
        int endX;
        int endY;
        Move(void) {}

        void input(int sX, int sY, int eX, int eY){
            startX = sX;
            startY = sY;
            endX = eX;
            endY = eY;
        }
};
  
class CheckerBoard {
    public:
        bool _isJumpPossible;
        int jpCheck;
        bool jumped;
        int iJump;
        int jJump;
        int board[8][8];
        bool crowned[8][8];
        int player;
        int moveCount;
        bool gameOver;
        Move moveList[32];

    CheckerBoard(int input[65]) {

        _isJumpPossible = false;
        jpCheck = -1;
        jumped = false;
        iJump = 0;
        jJump = 0;

        player = input[0];
        gameOver = false;
        int coord = 1;

        for (int i = 0; i < 8; i++) {
            for (int j = 0; j < 8; j++) {
                if (i % 2 == j % 2) {
                    board[i][j] = input[coord] - 1;
                    crowned[i][j] = input[coord + 1] == 1;
                    coord += 2;
                }else{
                    board[i][j] = 0;
                    crowned[i][j] = false;
                }
            }
        }
    }

    CheckerBoard(const CheckerBoard &input) {
        _isJumpPossible = input._isJumpPossible;
        jpCheck = input.jpCheck;
        jumped = input.jumped;
        iJump = input.iJump;
        jJump = input.jJump;
        player = input.player;
        gameOver = input.gameOver;

        memcpy (board, input.board, 64*sizeof(int));
        memcpy (crowned, input.crowned, 64*sizeof(bool));
    }

    
    bool checkDirection(int iO, int jO, int i, int j) {
        if (board[i][j] == player && (crowned[i][j] || iO == -player)) {
            return i + 2 * iO < 8 && i + 2 * iO >= 0 && j + 2 * jO < 8 && j + 2 * jO >= 0 && board[i + 2 * iO][j + 2 * jO] == 0 && board[i + iO][j + jO] == -player;
        }

        return false;
    }
    
    bool checkMoveDirection(int iO, int jO, int i, int j) {
        if (board[i][j] == player && (crowned[i][j] || iO == -player)) {
            return i + iO < 8 && i + iO >= 0 && j + jO < 8 && j + jO >= 0 && board[i + iO][j + jO] == 0;
        }

        return false;
    }

    bool checkWin() {
        bool player1 = false;
        bool player2 = false;

        for (int i = 0; i < 8; i++) {
            for (int j = 0; j < 8; j++) {
                if (board[i][j] == -1) {
                    player1 = true;
                } else if (board[i][j] == 1) {
                    player2 = true;
                }
            }
        }

        gameOver = !player1 || !player2;
        return gameOver;
    } 

    bool isJumpPossible() {
        if (jumped) {
            return checkDirection(1, 1, iJump, jJump) || checkDirection(1, -1, iJump, jJump) || checkDirection(-1, 1, iJump, jJump) || checkDirection(-1, -1, iJump, jJump);
        }

        for (int i = 0; i < 8; i += 1) {
            for (int j = 0; j < 8; j += 1) {
                if (checkDirection(1, 1, i, j) || checkDirection(1, -1, i, j) || checkDirection(-1, 1, i, j) || checkDirection(-1, -1, i, j)) {
                    return true;
                }
            }
        }

        return false;
    }

    bool isMovePossible() {
        if (isJumpPossible()) {
            return true;
        }

        for (int i = 0; i < 8; i++) {
            for (int j = 0; j < 8; j++) {
                if (checkMoveDirection(1, 1, i, j) ||
                    checkMoveDirection(1, -1, i, j) ||
                    checkMoveDirection(-1, 1, i, j) ||
                    checkMoveDirection(-1, -1, i, j)) {
                    return true;
                }
            }
        }

        return false;
    }

    void makeMove(Move move) {
        int startX = move.startX;
        int startY = move.startY;
        int endX = move.endX;
        int endY = move.endY;

        if (board[startX][startY] == player && board[endX][endY] == 0) {
            bool valid = false;

            if (abs(startX - endX) == 2 && abs(startY - endY) == 2) {
                if (board[(startX + endX) / 2][(startY + endY) / 2] == -player) {
                    if (crowned[startX][startY] || startX - endX == player * 2) {
                        board[(startX + endX) / 2][(startY + endY) / 2] = 0;
                        crowned[(startX + endX) / 2][(startY + endY) / 2] = false;
                        jumped = true;
                        iJump = endX;
                        jJump = endY;
                        valid = true;
                    }
                }
            } else {
                if (abs(startX - endX) == 1 && abs(startY - endY) == 1) {
                    if (crowned[startX][startY] || startX - endX == player) {
                        if (!isJumpPossible()) {
                            valid = true;
                        }
                    }
                }
            }

            if (valid) {
                board[startX][startY] = 0;
                board[endX][endY] = player;
                crowned[endX][endY] = crowned[startX][startY];
                crowned[startX][startY] = false;

                if ((endX == 8 - 1 && player == -1) || (endX == 0 && player == 1)) {
                    crowned[endX][endY] = true;
                }

                if (!checkWin() && !(jumped && isJumpPossible())) {
                    player = -player;
                    jumped = false;

                    if (!isMovePossible()) {
                        player = -player;

                        if (!isMovePossible()) {
                            gameOver = true;
                        }
                    }
                }
            } else {
                //BAD
            }
        }
    }

    void checkDirectionList(int iO, int jO, int i, int j) {
        if (checkDirection(iO, jO, i, j)) {
            moveList[moveCount++].input(i, j, i + 2 * iO, j + 2 * jO);
        }
    }

    void checkMoveDirectionList(int iO, int jO, int i, int j) {
        if (checkMoveDirection(iO, jO, i, j)) {
            moveList[moveCount++].input(i, j, i + iO, j + jO);
        }
    }

    void getMoveList(void) {
        moveCount = 0;
        bool jump = isJumpPossible();

        for (int i = 0; i < 8; i += 1) {
            for (int j = 0; j < 8; j += 1) {
                checkDirectionList(1, 1, i, j);
                checkDirectionList(1, -1, i, j);
                checkDirectionList(-1, 1, i, j);
                checkDirectionList(-1, -1, i, j);

                if (!jump) {
                    checkMoveDirectionList(1, 1, i, j);
                    checkMoveDirectionList(1, -1, i, j);
                    checkMoveDirectionList(-1, 1, i, j);
                    checkMoveDirectionList(-1, -1, i, j);
                }
            }
        }
    }
};
#endif