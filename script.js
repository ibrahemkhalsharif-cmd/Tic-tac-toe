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
}
function Updatecell(cell , index){
    options[index] = player;
    cell.textContent = player;

}
function Changeplayer(){
    player = (player == "X") ? "0" : "X";
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