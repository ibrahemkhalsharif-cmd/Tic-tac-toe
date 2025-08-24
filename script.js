const win_condition = [
    [0 , 1 , 2],
    [3 , 4 , 5],
    [6 , 7 , 8],
    [0 , 4 , 8],
    [0 , 3 , 6],
    [2 , 5 , 8],
    [2 , 4 , 6]

];
let player = "X";
let active = false;
let options = ["" , "" ,"" ,"" ,"" ,"" ,"" ,"" ,"" ,]
const cells = document.querySelectorAll(".cell");
const try_again = document.querySelector(".try-again");
const round_won_checker = document.querySelector(".round-won");

startgame();

function startgame(){
        active = true;
        cells.forEach(cell=> cell.addEventListener("click" , cellclicked))
}
function cellclicked(){
      const cellindex = this.getAttribute("id");
            if(options[cellindex] != "" || !active){
                return;
            }
            Updatecell(this , cellindex);
            checkwin();
            Changeplayer();
            if(active && player == "O")
            {
                aiMove();
            }
}
function Updatecell(cell , index){
    options[index] = player;
    cell.textContent = player;

}
function Changeplayer(){
    player = (player == "X") ? "O" : "X";
}
function aiMove(){
    let bestmove = -1;
    let bestscore = -Infinity;     /*We choose infinity for this so we can be certain that the best possible choice is chosen.*/ 
    for(let i = 0; i < options.length; i++){
        if(options[i] == ""){
            options[i] = "O";
            let score = minmax(options , false);
            options[i] = "";
            if(score > bestscore){
                bestscore = score;
                bestmove = i;
            }
        }

    }   
    Updatecell(cells[bestmove] , bestmove);
    checkwin();
    Changeplayer();

}
function minmax(board, ismax){
    let score = Minimax_winner(board);
    if(score != null){
        return score;
    }
    if(ismax){
        let bestscore = -Infinity;
        for(let i = 0; i < board.length;i++){
            if(board[i] == ""){
                board[i] = "O";
                let score = minmax(board, false);
                board[i] = "";
                bestscore = Math.max(score , bestscore);
            }
        }
        return bestscore;
    }
    else{
        let bestscore = Infinity;
        for(let i = 0; i < board.length; i++){
            if(board[i] == ""){
                board[i] = "X";
                let score = minmax(board, true);
                board[i] = "";
                bestscore = Math.min(score, bestscore);
            }
        }
        return bestscore;
    }
}
function Minimax_winner(board){
    for(let i = 0; i < win_condition.length; i++){
        const condition = win_condition[i];
        const cell_one = board[condition[0]];
        const cell_two = board[condition[1]];
        const cell_three = board[condition[2]];
        if(cell_one == cell_two && cell_two == cell_three){
            if(cell_one == "O"){
                return 1;
            }
            if(cell_one == "X")
            {
                return -1;
            }
            
        }

    }
    if(!board.includes("")){
        return 0;
    }
}
function checkwin(){
    let round_won = false;
    for(let i = 0; i < win_condition.length;i++){
        const condition = win_condition[i];
        const cell_one = options[condition[0]];
        const cell_two = options[condition[1]];
        const cell_three = options[condition[2]];
        if(cell_one == "" || cell_two == "" || cell_three == ""){
            continue;
        }
        if(cell_one == cell_two && cell_two == cell_three){
            round_won = true;
            active = false;
        }
    }
    if(round_won){
        round_won_checker.textContent = `${player} won the game`;
        return;
    
    }
    else if(!options.includes(""))
    {
        round_won_checker.textContent = `DRAW!`;
        
    }
}
try_again.addEventListener("click",()=>{
    location.reload();

})