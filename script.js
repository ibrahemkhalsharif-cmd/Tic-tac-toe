const win_condition = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [0, 3, 6],
    [2, 5, 8],
    [2, 4, 6],
    [1, 4, 7]

]

const x_button = document.getElementById("X");
const o_button = document.getElementById("O");

let player = "";
let current_player = "";
let active = false;
const params = new URLSearchParams(window.location.search);
let difficulty_chosen = params.get("difficulty") || "easy";
let options = ["", "", "", "", "", "", "", "", ""];
const cells = document.querySelectorAll(".cell");
const try_again = document.querySelector(".try-again");
const round_won_checker = document.querySelector(".round-won");



function startGame(chosen_player) {
    player = chosen_player;
    active = true;
    cells.forEach(cell => cell.addEventListener("click", cellClicked))
    if(player == "O"){
        player = "X";
        aiMove();
    }

}
x_button.addEventListener("click", () =>{
    current_player = "X";
    startGame("X");
})
o_button.addEventListener("click", () =>{
    current_player = "O";
    startGame("O");
})

function cellClicked() {
    const cellindex = this.getAttribute("id");
    if (options[cellindex] != "" || !active) {
        return;
    }
    updateCell(this, cellindex);
    checkWin();
    changePlayer();
    if (active && player !== current_player) {
        aiMove();
    }
}
function updateCell(cell, index) {
    options[index] = player;
    cell.textContent = player;

}
function changePlayer() {
    player = (player == "X") ? "O" : "X";
}
function aiMove() {
    if (difficulty_chosen == "easy") {
        easyAi();
    }
    else if (difficulty_chosen == "medium") {
        mediumAi();
    }
    else {
        aiHard();
    }


}
function easyAi() {
    const empty_options = []
    for (let i = 0; i < options.length; i++) {
        if (options[i] == "") {
            empty_options.push(i);
        }

    }
    let index = Math.floor(Math.random() * empty_options.length);
    let move = empty_options[index];
    updateCell(cells[move], move);
    checkWin();
    changePlayer();

}
function mediumAi() {
    if (Math.random() < 0.5) {
        easyAi();
    }
    else {
        aiHard();
    }
}
function aiHard() {
    let bestmove = -1;
    let bestscore = -Infinity;     /*We choose infinity for this so we can be certain that the best possible choice is chosen.*/
    for (let i = 0; i < options.length; i++) {
        if (options[i] == "") {
            options[i] = "O";
            let score = minMax(options, false);
            options[i] = "";
            if (score > bestscore) {
                bestscore = score;
                bestmove = i;
            }
        }

    }
    updateCell(cells[bestmove], bestmove);
    checkWin();
    changePlayer();
}

function minMax(board, ismax) {
    let score = miniMaxWinner(board);
    if (score !== undefined) {
        return score;
    }
    if (ismax) {
        let bestscore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] == "") {
                board[i] = "O";
                let score = minMax(board, false);
                board[i] = "";
                bestscore = Math.max(score, bestscore);
            }
        }
        return bestscore;
    }
    else {
        let bestscore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] == "") {
                board[i] = "X";
                let score = minMax(board, true);
                board[i] = "";
                bestscore = Math.min(score, bestscore);
            }
        }
        return bestscore;
    }
}
function miniMaxWinner(board) {
    for (let i = 0; i < win_condition.length; i++) {
        const condition = win_condition[i];
        const cell_one = board[condition[0]];
        const cell_two = board[condition[1]];
        const cell_three = board[condition[2]];
        if (cell_one == cell_two && cell_two == cell_three) {
            if (cell_one == "O") {
                return 1;
            }
            if (cell_one == "X") {
                return -1;
            }

        }

    }
    if (!board.includes("")) {
        return 0;
    }
}
function checkWin() {
    let round_won = false;
    for (let i = 0; i < win_condition.length; i++) {
        const condition = win_condition[i];
        const cell_one = options[condition[0]];
        const cell_two = options[condition[1]];
        const cell_three = options[condition[2]];
        if (cell_one == "" || cell_two == "" || cell_three == "") {
            continue;
        }
        if (cell_one == cell_two && cell_two == cell_three) {
            round_won = true;
            active = false;
        }
    }
    if (round_won) {
        round_won_checker.textContent = `${player} won the game`;
        return;

    }
    else if (!options.includes("")) {
        round_won_checker.textContent = `DRAW!`;

    }
}
    try_again.addEventListener("click", () => {
        player = "X";
        options = ["", "", "", "", "", "", "", "", ""];

        cells.forEach(cell => {
            cell.textContent = "";

        })
        active = true;
        round_won_checker.textContent = "";
        if(player == "O"){
            aiMove();
        }


    })