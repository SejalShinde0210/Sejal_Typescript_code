"use strict";

// Bind Esc key to closing the modal dialog
document.onkeypress = function (evt: KeyboardEvent) {
    evt = evt || window.event;
    var modal = document.getElementsByClassName("modal")[0] as HTMLElement;
    if (evt.keyCode === 27) {
        modal.style.display = "none";
    }
};

// When the user clicks anywhere outside of the modal dialog, close it
window.onclick = function (evt: MouseEvent) {
    var modal = document.getElementsByClassName("modal")[0] as HTMLElement;
    if (evt.target === modal) {
        modal.style.display = "none";
    }
};

function sumArray(array: number[]): number {
    var sum = 0;
    for (var i = 0; i < array.length; i++) {
        sum += array[i];
    }
    return sum;
}

function isInArray(element: number, array: number[]): boolean {
    return array.indexOf(element) > -1;
}

function shuffleArray(array: number[]): number[] {
    var counter = array.length,
        temp: number,
        index: number;
    while (counter > 0) {
        index = Math.floor(Math.random() * counter);
        counter--;
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
    return array;
}

function intRandom(min: number, max: number): number {
    var rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

// GLOBAL VARIABLES
var moves: number = 0,
    winner: number = 0,
    x: number = 1,
    o: number = 3,
    player: number = x,
    computer: number = o,
    whoseTurn: number = x,
    gameOver: boolean = false,
    score: { ties: number, player: number, computer: number } = {
        ties: 0,
        player: 0,
        computer: 0
    },
    xText: string = "<span class=\"x\">&times;</class>",
    oText: string = "<span class=\"o\">o</class>",
    playerText: string = xText,
    computerText: string = oText,
    difficulty: number = 1,
    myGrid: Grid = null;

class Grid {
    cells: number[];

    constructor() {
        this.cells = new Array(9);
    }

    getFreeCellIndices(): number[] {
        var resultArray: number[] = [];
        for (var i = 0; i < this.cells.length; i++) {
            if (this.cells[i] === 0) {
                resultArray.push(i);
            }
        }
        return resultArray;
    }

    getRowValues(index: number): number[] {
        if (index !== 0 && index !== 1 && index !== 2) {
            console.error("Wrong arg for getRowValues!");
            return undefined;
        }
        var i = index * 3;
        return this.cells.slice(i, i + 3);
    }

    getRowIndices(index: number): number[] {
        if (index !== 0 && index !== 1 && index !== 2) {
            console.error("Wrong arg for getRowIndices!");
            return undefined;
        }
        var row = [];
        index = index * 3;
        row.push(index);
        row.push(index + 1);
        row.push(index + 2);
        return row;
    }

    getColumnValues(index: number): number[] {
        if (index !== 0 && index !== 1 && index !== 2) {
            console.error("Wrong arg for getColumnValues!");
            return undefined;
        }
        var i, column = [];
        for (i = index; i < this.cells.length; i += 3) {
            column.push(this.cells[i]);
        }
        return column;
    }

    getColumnIndices(index: number): number[] {
        if (index !== 0 && index !== 1 && index !== 2) {
            console.error("Wrong arg for getColumnIndices!");
            return undefined;
        }
        var i, column = [];
        for (i = index; i < this.cells.length; i += 3) {
            column.push(i);
        }
        return column;
    }

    getDiagValues(arg: number): number[] {
        var cells = [];
        if (arg !== 1 && arg !== 0) {
            console.error("Wrong arg for getDiagValues!");
            return undefined;
        } else if (arg === 0) {
            cells.push(this.cells[0]);
            cells.push(this.cells[4]);
            cells.push(this.cells[8]);
        } else {
            cells.push(this.cells[2]);
            cells.push(this.cells[4]);
            cells.push(this.cells[6]);
        }
        return cells;
    }

    getDiagIndices(arg: number): number[] {
        if (arg !== 1 && arg !== 0) {
            console.error("Wrong arg for getDiagIndices!");
            return undefined;
        } else if (arg === 0) {
            return [0, 4, 8];
        } else {
            return [2, 4, 6];
        }
    }

    getFirstWithTwoInARow(agent: number): number | boolean {
        if (agent !== computer && agent !== player) {
            console.error("Function getFirstWithTwoInARow accepts only player or computer as argument.");
            return undefined;
        }
        var sum = agent * 2,
            freeCells = shuffleArray(this.getFreeCellIndices());
        for (var i = 0; i < freeCells.length; i++) {
            for (var j = 0; j < 3; j++) {
                var rowV = this.getRowValues(j);
                var rowI = this.getRowIndices(j);
                var colV = this.getColumnValues(j);
                var colI = this.getColumnIndices(j);
                if (sumArray(rowV) == sum && isInArray(freeCells[i], rowI)) {
                    return freeCells[i];
                } else if (sumArray(colV) == sum && isInArray(freeCells[i], colI)) {
                    return freeCells[i];
                }
            }
            for (j = 0; j < 2; j++) {
                var diagV = this.getDiagValues(j);
                var diagI = this.getDiagIndices(j);
                if (sumArray(diagV) == sum && isInArray(freeCells[i], diagI)) {
                    return freeCells[i];
                }
            }
        }
        return false;
    }

    reset(): boolean {
        for (var i = 0; i < this.cells.length; i++) {
            this.cells[i] = 0;
        }
        return true;
    }
}

function initialize() {
    myGrid = new Grid();
    moves = 0;
    winner = 0;
    gameOver = false;
    whoseTurn = player;
    for (var i = 0; i <= myGrid.cells.length - 1; i++) {
        myGrid.cells[i] = 0;
    }
    setTimeout(showOptions, 500);
}

// Ask player if they want to play as X or O. X goes first.
function assignRoles() {
    askUser("Do you want to go first?");
    document.getElementById("yesBtn").addEventListener("click", makePlayerX);
    document.getElementById("noBtn").addEventListener("click", makePlayerO);
}

function makePlayerX() {
    player = x;
    computer = o;
    whoseTurn = player;
    playerText = xText;
    computerText = oText;
    document.getElementById("userFeedback").style.display = "none";
    document.getElementById("yesBtn").removeEventListener("click", makePlayerX);
    document.getElementById("noBtn").removeEventListener("click", makePlayerO);
}

function makePlayerO() {
    player = o;
    computer = x;
    whoseTurn = computer;
    playerText = oText;
    computerText = xText;
    setTimeout(makeComputerMove, 400);
    document.getElementById("userFeedback").style.display = "none";
    document.getElementById("yesBtn").removeEventListener("click", makePlayerX);
    document.getElementById("noBtn").removeEventListener("click", makePlayerO);
}

function cellClicked(id: string) {
    var idName = id.toString();
    var cell = parseInt(idName[idName.length - 1]);
    if (myGrid.cells[cell] > 0 || whoseTurn !== player || gameOver) {
        return false;
    }
    moves += 1;
    document.getElementById(id).innerHTML = playerText;
    var rand = Math.random();
    if (rand < 0.3) {
        document.getElementById(id).style.transform = "rotate(180deg)";
    } else if (rand > 0.6) {
        document.getElementById(id).style.transform = "rotate(90deg)";
    }
    document.getElementById(id).style.cursor = "default";
    myGrid.cells[cell] = player;
    if (moves >= 5) {
        winner = checkWin();
    }
    if (winner === 0) {
        whoseTurn = computer;
        makeComputerMove();
    }
    return true;
}

function restartGame(ask: boolean) {
    if (moves > 0) {
        var response = confirm("Are you sure you want to start over?");
        if (response === false) {
            return;
        }
    }
    gameOver = false;
    moves = 0;
    winner = 0;
    whoseTurn = x;
    myGrid.reset();
    for (var i = 0; i <= 8; i++) {
        var id = "cell" + i.toString();
        document.getElementById(id).innerHTML = "";
        document.getElementById(id).style.cursor = "pointer";
        document.getElementById(id).classList.remove("win-color");
    }
    if (ask === true) {
        setTimeout(showOptions, 200);
    } else if (whoseTurn == computer) {
        setTimeout(makeComputerMove, 800);
    }
}

function makeComputerMove() {
    if (gameOver) {
        return false;
    }
    var cell = -1,
        myArr = [],
        corners = [0, 2, 6, 8];
    if (moves >= 3) {
        cell = myGrid.getFirstWithTwoInARow(computer);
        if (cell === false) {
            cell = myGrid.getFirstWithTwoInARow(player);
        }
        if (cell === false) {
            if (myGrid.cells[4] === 0 && difficulty == 1) {
                cell = 4;
            } else {
                myArr = myGrid.getFreeCellIndices();
                cell = myArr[intRandom(0, myArr.length - 1)];
            }
        }
        if (moves == 3 && myGrid.cells[4] == computer && player == x && difficulty == 1) {
            if (myGrid.cells[7] == player && (myGrid.cells[0] == player || myGrid.cells[2] == player)) {
                myArr = [6, 8];
                cell = myArr[intRandom(0, 1)];
            }
            else if (myGrid.cells[5] == player && (myGrid.cells[0] == player || myGrid.cells[6] == player)) {
                myArr = [2, 8];
                cell = myArr[intRandom(0, 1)];
            }
            else if (myGrid.cells[3] == player && (myGrid.cells[2] == player || myGrid.cells[8] == player)) {
                myArr = [0, 6];
                cell = myArr[intRandom(0, 1)];
            }
            else if (myGrid.cells[1] == player && (myGrid.cells[6] == player || myGrid.cells[8] == player)) {
                myArr = [0, 2];
                cell = myArr[intRandom(0, 1)];
            }
        }
        else if (moves == 3 && myGrid.cells[4] == player && player == x && difficulty == 1) {
            if (myGrid.cells[2] == player && myGrid.cells[6] == computer) {
                cell = 8;
            }
            else if (myGrid.cells[0] == player && myGrid.cells[8] == computer) {
                cell = 6;
            }
            else if (myGrid.cells[8] == player && myGrid.cells[0] == computer) {
                cell = 2;
            }
            else if (myGrid.cells[6] == player && myGrid.cells[2] == computer) {
                cell = 0;
            }
        }
    } else if (moves === 1 && myGrid.cells[4] == player && difficulty == 1) {
        cell = corners[intRandom(0, 3)];
    } else if (moves === 2 && myGrid.cells[4] == player && computer == x && difficulty == 1) {
        if (myGrid.cells[0] == computer) {
            cell = 8;
        }
        else if (myGrid.cells[2] == computer) {
            cell = 6;
        }
        else if (myGrid.cells[6] == computer) {
            cell = 2;
        }
        else if (myGrid.cells[8] == computer) {
            cell = 0;
        }
    } else if (moves === 0 && intRandom(1, 10) < 8) {
        cell = corners[intRandom(0, 3)];
    } else {
        if (myGrid.cells[4] === 0 && difficulty == 1) {
            cell = 4;
        } else {
            myArr = myGrid.getFreeCellIndices();
            cell = myArr[intRandom(0, myArr.length - 1)];
        }
    }
    var id = "cell" + cell.toString();
    document.getElementById(id).innerHTML = computerText;
    document.getElementById(id).style.cursor = "default";
    var rand = Math.random();
    if (rand < 0.3) {
        document.getElementById(id).style.transform = "rotate(180deg)";
    } else if (rand > 0.6) {
        document.getElementById(id).style.transform = "rotate(90deg)";
    }
    myGrid.cells[cell] = computer;
    moves += 1;
    if (moves >= 5) {
        winner = checkWin();
    }
    if (winner === 0 && !gameOver) {
        whoseTurn = player;
    }
}

function checkWin(): number {
    winner = 0;
    for (var i = 0; i <= 2; i++) {
        var row = myGrid.getRowValues(i);
        if (row[0] > 0 && row[0] == row[1] && row[0] == row[2]) {
            if (row[0] == computer) {
                score.computer++;
                winner = computer;
            } else {
                score.player++;
                winner = player;
            }
            var tmpAr = myGrid.getRowIndices(i);
            for (var j = 0; j < tmpAr.length; j++) {
                var str = "cell" + tmpAr[j];
                document.getElementById(str).classList.add("win-color");
            }
            setTimeout(endGame, 1000, winner);
            return winner;
        }
    }
    for (i = 0; i <= 2; i++) {
        var col = myGrid.getColumnValues(i);
        if (col[0] > 0 && col[0] == col[1] && col[0] == col[2]) {
            if (col[0] == computer) {
                score.computer++;
                winner = computer;
            } else {
                score.player++;
                winner = player;
            }
            var tmpAr = myGrid.getColumnIndices(i);
            for (var j = 0; j < tmpAr.length; j++) {
                var str = "cell" + tmpAr[j];
                document.getElementById(str).classList.add("win-color");
            }
            setTimeout(endGame, 1000, winner);
            return winner;
        }
    }
    for (i = 0; i <= 1; i++) {
        var diagonal = myGrid.getDiagValues(i);
        if (diagonal[0] > 0 && diagonal[0] == diagonal[1] && diagonal[0] == diagonal[2]) {
            if (diagonal[0] == computer) {
                score.computer++;
                winner = computer;
            } else {
                score.player++;
                winner = player;
            }
            var tmpAr = myGrid.getDiagIndices(i);
            for (var j = 0; j < tmpAr.length; j++) {
                var str = "cell" + tmpAr[j];
                document.getElementById(str).classList.add("win-color");
            }
            setTimeout(endGame, 1000, winner);
            return winner;
        }
    }
    if (winner === 0 && moves === 9) {
        score.ties++;
        setTimeout(endGame, 1000, winner);
    }
    return winner;
}

function endGame(winner: number) {
    if (winner === 0) {
        alert("Tie game!");
    } else if (winner === player) {
        alert("Congratulations! You win!");
    } else if (winner === computer) {
        alert("The computer wins. Better luck next time!");
    }
    setTimeout(restartGame, 2000, true);
}

function showOptions() {
    document.getElementById("userFeedback").style.display = "block";
}

function askUser(question: string) {
    document.getElementById("userFeedback").style.display = "block";
    document.getElementById("userFeedback").innerHTML = question;
}
