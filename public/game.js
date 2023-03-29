var ctx = canvas.getContext("2d", { alpha: false });
const HUMAN = 1;
window.addEventListener("mousedown", async event => {
    if(board.player != HUMAN) return;
    var rect = canvas.getBoundingClientRect();
    var x = Math.floor((event.clientY - rect.top) / scale);
    var y = Math.floor((event.clientX - rect.left) / scale);
	
    if(board.board[x][y] == board.player){
        moveStart = { x, y };
    }

    if(moveStart){
        board.makeMove({ startX: moveStart.x, startY: moveStart.y, endY: y, endX: x });
        
	    render();
        await new Promise(resolve => setTimeout(resolve, 100));
        while(board.player != HUMAN){
            moveStart = null;
            var p = new Promise(resolve => setTimeout(resolve, 1000));
            board.makeMove(GetMove(board));
            await p;
	        render();
        }
    }
});

var scale = Math.min(window.innerHeight, window.innerWidth) / 8;
//var board = new CheckerBoard("2 1-1-1-1- 1-1-1-1- 1-1-1-1- 1-1-1-1- 1-1-1-1- 1-1-1-1- 1-1-1-0C 1-2C1-0C");
var board = new CheckerBoard();

render(); 

var moveStart = null;

function render(){
    for(var i = 0; i < 8; i++){
        for(var j = 0; j < 8; j++){
            ctx.fillStyle = i % 2 === j % 2 ? "#d0d0d0" : "#313131";
            ctx.fillRect(j * scale, i * scale, scale, scale);

            if(board.board[i][j]){
                if(moveStart && i == moveStart.x && j == moveStart.y){
                    ctx.fillStyle = "white";
                    ctx.beginPath()
                    ctx.arc(j * scale + scale / 2, i * scale + scale / 2, scale / 2 - 5, 0, Math.PI*2);
                    ctx.fill();
                }

                ctx.fillStyle = board.board[i][j] == -1 ? "red" : "black";
                ctx.beginPath()
                ctx.arc(j * scale + scale / 2, i * scale + scale / 2, scale / 2 - 10, 0, Math.PI*2);
                ctx.fill();

                if(board.crowned[i][j]){
                    ctx.fillStyle = "#d0d0d0";
                    ctx.beginPath()
                    ctx.arc(j * scale + scale / 2, i * scale + scale / 2, 10, 0, Math.PI*2);
                    ctx.fill();
                }
            }
        }
    }
}

async function arena(){
    while(!board.gameOver){
        board.makeMove(GetMove(board));
        
        render();
        await new Promise(resolve => setTimeout(resolve, 100));
    }
}