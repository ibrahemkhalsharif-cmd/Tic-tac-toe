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

const choice_buttons = document.querySelectorAll(".choose");

let player = "";
let aiplayer = "";
let current_player = "";
let active = false;
const params = new URLSearchParams(window.location.search);
let difficulty_chosen = params.get("difficulty") || "easy";
let options = Array(9).fill("");
const cells = document.querySelectorAll(".cell");
const try_again = document.querySelector(".try-again");
const round_won_checker = document.querySelector(".round-won");
const small_tab = document.querySelectorAll(".small_tab_buttons");
let round_won = false;

function startGame(chosen_player) {
    player = chosen_player;
    aiplayer = (player == "X") ? "O" : "X";
    current_player = "X";
    active = true;
    cells.forEach(cell => cell.addEventListener("click", cellClicked))
    if (current_player == aiplayer) {
        aiMove();
    }

}
console.log(difficulty_chosen);
small_tab.forEach(button => {
    if (button.dataset.dif == difficulty_chosen) {
        button.classList.add("active");

    }
    small_tab.forEach(btn => btn.disabled = true);
})

choice_buttons.forEach(button => {
    button.addEventListener("click", function () {
        choice_buttons.forEach(btn => btn.classList.remove("active"));
        this.classList.add("active");
        const chosen_player = this.getAttribute("data-dif");
        if (chosen_player == "X" || chosen_player == "O") {
            choice_buttons.forEach(btn => btn.disabled = true);
        }
        startGame(chosen_player);
    })
})
console.log(player);
console.log(aiplayer);
//remove the colors from the buttons when disabling them
small_tab.forEach(button => {
    button.addEventListener("click", function () {
        small_tab.forEach(btn => btn.classList.remove("active"));
        this.classList.add("active");
        const url = new URLSearchParams(window.location.search);
        url.set("difficulty", this.getAttribute("data-dif"));
        difficulty_chosen = this.getAttribute("data-dif");
        window.history.replaceState({}, '', `${window.location.pathname}?${url}`);
        if (difficulty_chosen == "easy" || difficulty_chosen == "medium" || difficulty_chosen == "hard") {
            small_tab.forEach(btn => btn.disabled = true);
        }
        console.log(difficulty_chosen);

    })
})

function cellClicked() {
    const cellindex = this.getAttribute("id");
    if (options[cellindex] != "" || !active || round_won) {
        return;
    }
    if (player == current_player) {
        updateCell(this, cellindex);
        checkWin();
        changePlayer();
    

    if (active && player !== current_player) {
        active = false;
        setTimeout(function () {
            aiMove();
            active = true;
        }, 1000)
    }
   }
}
function updateCell(cell, index) {
    options[index] = current_player;
    cell.textContent = current_player;

}
function changePlayer() {
    current_player = (current_player == "X") ? "O" : "X";
}
function aiMove() {
    if (round_won) {
        return;
    }

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
// make the probability of hard to be more than easy.
function mediumAi() {
    if (Math.random() < 0.2) {
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
            options[i] = aiplayer;
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
                board[i] = aiplayer;
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
                board[i] = player;
                let score = minMax(board, true);
                board[i] = "";
                bestscore = Math.min(score, bestscore);
            }
        }
        return bestscore;
    }
}
// Check for the winner in the minimax function meaning only for the ai, not for the main game. so it can return a valid score to help the ai.
function miniMaxWinner(board) {
    for (let i = 0; i < win_condition.length; i++) {
        const condition = win_condition[i];
        const cell_one = board[condition[0]];
        const cell_two = board[condition[1]];
        const cell_three = board[condition[2]];
        if (cell_one == cell_two && cell_two == cell_three) {
            if (cell_one == aiplayer) {
                return 1;
            }
            if (cell_one == player) {
                return -1;
            }

        }

    }
    if (!board.includes("")) {
        return 0;
    }
}
//Check for the win on the main game itself accounting for every change.
function checkWin() {

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
        round_won_checker.textContent = `${current_player} won the game`;
        return;

    }
    else if (!options.includes("")) {
        round_won_checker.textContent = `DRAW!`;

    }
}
// when try again is clicked you should remove the params.

try_again.addEventListener("click", () => {

    options = Array(9).fill("");
    player = "";
    aiplayer = "";


    cells.forEach(cell => {
        cell.textContent = "";

    })

    round_won_checker.textContent = "";
    round_won = false;

    const url = new URL(window.location.href);
    url.searchParams.delete("difficulty");
    window.history.replaceState({}, '', url.pathname);


    choice_buttons.forEach(btn => btn.disabled = false);
    choice_buttons.forEach(btn => btn.classList.remove("active"));
    small_tab.forEach(btn => btn.disabled = false);
    small_tab.forEach(btn => btn.classList.remove("active"));
    active = false;


})