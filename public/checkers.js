class Move {
    constructor(startX, startY, endX, endY) {
      this.startX = startX;
      this.startY = startY;
      this.endX = endX;
      this.endY = endY;
    }
}
  
class CheckerBoard {

    constructor(boardString) {
        if(!boardString){
            boardString = "2 0-0-0-0- 0-0-0-0- 0-0-0-0- 1-1-1-1- 1-1-1-1- 2-2-2-2- 2-2-2-2- 2-2-2-2-"
        }

        if(typeof boardString != 'string'){
            var board = boardString;
            this.move = board.move;
            this._isJumpPossible = board._isJumpPossible;
            this.jpCheck = board.jpCheck;
            this.jumped = board.jumped;
            this.iJump = board.iJump;
            this.jJump = board.jJump;
    
            this.board = JSON.parse(JSON.stringify(board.board));
            this.crowned = JSON.parse(JSON.stringify(board.crowned));
    
            this.player = board.player;
            this.gameOver = board.gameOver;
            return;
        }

        var coord;
        this.move = 0;
        this._isJumpPossible = false;
        this.jpCheck = -1;
        this.jumped = false;
        this.iJump = 0;
        this.jJump = 0;

        this.board = [];
        this.crowned = [];
        for (var i = 0; i < 8; i += 1) {
            this.board[i] = [];
            this.crowned[i] = [];
            for (var j = 0; j < 8; j += 1) {
                this.board[i][j] = this.crowned[i][j] = 0;
            }
        }

        this.player = Number.parseInt(boardString.slice(0, 1)) - 1;
        this.gameOver = false;
        coord = 2;

        for (var i = 0; i < 8; i += 1) {
            for (var j = 0; j < 8; j += 1) {
                if (i % 2 === j % 2) {
                    this.board[i][j] = Number.parseInt(boardString.slice(coord, coord + 1)) - 1;
                    coord += 1;
                    this.crowned[i][j] = boardString.slice(coord, coord + 1) === "C";
                    coord += 1;
                }
            }

            coord += 1;
        }
    }

    checkDirection(iO, jO, i, j) {
        if (this.board[i][j] === this.player && (this.crowned[i][j] || iO === -this.player)) {
            return i + 2 * iO < 8 && i + 2 * iO >= 0 && j + 2 * jO < 8 && j + 2 * jO >= 0 && this.board[i + 2 * iO][j + 2 * jO] === 0 && this.board[i + iO][j + jO] === -this.player;
        }

        return false;
    }

    checkMoveDirection(iO, jO, i, j) {
        if (this.board[i][j] === this.player && (this.crowned[i][j] || iO === -this.player)) {
            return i + iO < 8 && i + iO >= 0 && j + jO < 8 && j + jO >= 0 && this.board[i + iO][j + jO] === 0;
        }

        return false;
    }

    checkDirectionList(iO, jO, i, j, list) {
        if (this.checkDirection(iO, jO, i, j)) {
            list.push(new Move(i, j, i + 2 * iO, j + 2 * jO));
        }
    }

    checkMoveDirectionList(iO, jO, i, j, list) {
        if (this.checkMoveDirection(iO, jO, i, j)) {
            list.push(new Move(i, j, i + iO, j + jO));
        }
    }

    getMoveList() {
        var jump, list;
        list = [];
        jump = this.isJumpPossible();

        for (var i = 0; i < 8; i += 1) {
            for (var j = 0; j < 8; j += 1) {
                this.checkDirectionList(1, 1, i, j, list);
                this.checkDirectionList(1, -1, i, j, list);
                this.checkDirectionList(-1, 1, i, j, list);
                this.checkDirectionList(-1, -1, i, j, list);

                if (!jump) {
                    this.checkMoveDirectionList(1, 1, i, j, list);
                    this.checkMoveDirectionList(1, -1, i, j, list);
                    this.checkMoveDirectionList(-1, 1, i, j, list);
                    this.checkMoveDirectionList(-1, -1, i, j, list);
                }
            }
        }

        return list;
    }

    checkWin() {
        var player1, player2;
        player1 = false;
        player2 = false;

        for (var i = 0; i < 8; i += 1) {
            for (var j = 0; j < 8; j += 1) {
                if (this.board[i][j] === -1) {
                    player1 = true;
                } else {
                    if (this.board[i][j] === 1) {
                        player2 = true;
                    }
                }
            }
        }

        this.gameOver = !player1 || !player2;
        return this.gameOver;
    }

    isJumpPossible() {
        var retVal;

        if (this.jumped) {
            retVal = this.checkDirection(1, 1, this.iJump, this.jJump) || this.checkDirection(1, -1, this.iJump, this.jJump) || this.checkDirection(-1, 1, this.iJump, this.jJump) || this.checkDirection(-1, -1, this.iJump, this.jJump);
            return retVal;
        }

        for (var i = 0; i < 8; i += 1) {
            for (var j = 0; j < 8; j += 1) {
                if (this.checkDirection(1, 1, i, j) || this.checkDirection(1, -1, i, j) || this.checkDirection(-1, 1, i, j) || this.checkDirection(-1, -1, i, j)) {
                    return true;
                }
            }
        }

        return false;
    }

    isMovePossible() {
        if (this.isJumpPossible()) {
            return true;
        }

        for (var i = 0; i < 8; i += 1) {
            for (var j = 0; j < 8; j += 1) {
                if (this.checkMoveDirection(1, 1, i, j) ||
                    this.checkMoveDirection(1, -1, i, j) ||
                    this.checkMoveDirection(-1, 1, i, j) ||
                    this.checkMoveDirection(-1, -1, i, j)) {
                    return true;
                }
            }
        }

        return false;
    }

    makeMove(move) {
        var endX, endY, startX, startY, valid;
        startX = move.startX;
        startY = move.startY;
        endX = move.endX;
        endY = move.endY;

        if (this.board[startX][startY] === this.player && this.board[endX][endY] === 0) {
            valid = false;

            if (Math.abs(startX - endX) === 2 && Math.abs(startY - endY) === 2) {
                if (this.board[Number.parseInt((startX + endX) / 2)][Number.parseInt((startY + endY) / 2)] === -this.player) {
                    if (this.crowned[startX][startY] || startX - endX === this.player * 2) {
                        this.board[Number.parseInt((startX + endX) / 2)][Number.parseInt((startY + endY) / 2)] = 0;
                        this.crowned[Number.parseInt((startX + endX) / 2)][Number.parseInt((startY + endY) / 2)] = false;
                        this.jumped = true;
                        this.iJump = endX;
                        this.jJump = endY;
                        valid = true;
                    }
                }
            } else {
                if (Math.abs(startX - endX) === 1 && Math.abs(startY - endY) === 1) {
                    if (this.crowned[startX][startY] || startX - endX === this.player) {
                        if (!this.isJumpPossible()) {
                        valid = true;
                        }
                    }
                }
            }

            if (valid) {
                this.board[startX][startY] = 0;
                this.board[endX][endY] = this.player;
                this.move += 1;
                this.crowned[endX][endY] = this.crowned[startX][startY];
                this.crowned[startX][startY] = false;

                if (endX === 8 - 1 && this.player === -1 || endX === 0 && this.player === 1) {
                    this.crowned[endX][endY] = true;
                }

                if (!this.checkWin() && !(this.jumped && this.isJumpPossible())) {
                    this.player = -this.player;
                    this.jumped = false;

                    if (!this.isMovePossible()) {
                        this.player = -this.player;

                        if (!this.isMovePossible()) {
                        this.gameOver = true;
                        }
                    }
                }
            } else {
                console.log("Move failed");
            }
        }
    }

    toString() {
        var returnString, val;
        returnString = (this.player + 1).toString();

        for (var i = 0; i < 8; i += 1) {
            returnString += "\n";

            for (var j = 0; j < 8; j += 1) {
                val = this.board[i][j];
                returnString += val === -1 ? "O" : val === 0 ? " " : "X";

                if (this.crowned[i][j]) {
                    returnString += "C";
                } else {
                    returnString += "-";
                }
            }
        }

        return returnString;
    }

}
  