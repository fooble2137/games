var playerRed = "R";
var playerYellow = "Y";
var currPlayer;

var gameOver = false;
var board;
var currColumns;

var rows = 6;
var columns = 7;

window.onload = function () {
  startGame();
};

function startGame() {
  currPlayer = randomPlayer();
  if (currPlayer == playerRed) {
    document.getElementById("current-player").innerHTML = "🔴";
  } else {
    document.getElementById("current-player").innerHTML = "🟡";
  }

  board = [];
  currColumns = [5, 5, 5, 5, 5, 5, 5];

  for (let r = 0; r < rows; r++) {
    let row = [];

    for (let c = 0; c < columns; c++) {
      row.push(" ");

      let title = document.createElement("div");
      title.id = r.toString() + "-" + c.toString();
      title.classList.add("tile");
      title.addEventListener("click", setPiece);

      document.getElementById("board").appendChild(title);
    }

    board.push(row);
  }
}

function setPiece() {
  if (gameOver) {
    return;
  }

  let coords = this.id.split("-");
  let r = parseInt(coords[0]);
  let c = parseInt(coords[1]);

  r = currColumns[c];
  if (r < 0) {
    return;
  }

  board[r][c] = currPlayer;
  let tile = document.getElementById(r.toString() + "-" + c.toString());

  if (currPlayer == playerRed) {
    tile.classList.add("red");
    tile.innerHTML = `<div style="width: 50%; height: 50%; background-color: ${shadeColor("#ff0000", -10)}; border-radius: 50%;"></div>`;

    currPlayer = playerYellow;
    document.getElementById("current-player").innerHTML = "🟡";
  } else {
    tile.classList.add("yellow");
    tile.innerHTML = `<div style="width: 50%; height: 50%; background-color: ${shadeColor("#ffff00", -10)}; border-radius: 50%;"></div>`;

    currPlayer = playerRed;
    document.getElementById("current-player").innerHTML = "🔴";
  }

  r -= 1;
  currColumns[c] = r;

  checkWinner();
}

function checkWinner() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns - 3; c++) {
      if (board[r][c] != " ") {
        if (
          board[r][c] == board[r][c + 1] &&
          board[r][c + 1] == board[r][c + 2] &&
          board[r][c + 2] == board[r][c + 3]
        ) {
          setWinner(r, c);
          return;
        }
      }
    }
  }

  for (let c = 0; c < columns; c++) {
    for (let r = 0; r < rows - 3; r++) {
      if (board[r][c] != " ") {
        if (
          board[r][c] == board[r + 1][c] &&
          board[r + 1][c] == board[r + 2][c] &&
          board[r + 2][c] == board[r + 3][c]
        ) {
          setWinner(r, c);
          return;
        }
      }
    }
  }

  for (let r = 0; r < rows - 3; r++) {
    for (let c = 0; c < columns - 3; c++) {
      if (board[r][c] != " ") {
        if (
          board[r][c] == board[r + 1][c + 1] &&
          board[r + 1][c + 1] == board[r + 2][c + 2] &&
          board[r + 2][c + 2] == board[r + 3][c + 3]
        ) {
          setWinner(r, c);
          return;
        }
      }
    }
  }

  for (let r = 3; r < rows; r++) {
    for (let c = 0; c < columns - 3; c++) {
      if (board[r][c] != " ") {
        if (
          board[r][c] == board[r - 1][c + 1] &&
          board[r - 1][c + 1] == board[r - 2][c + 2] &&
          board[r - 2][c + 2] == board[r - 3][c + 3]
        ) {
          setWinner(r, c);
          return;
        }
      }
    }
  }
}

function setWinner(r, c) {
  let modal = document.getElementById("modal");
  let modalTitle = document.getElementById("modal-title");
  let modalMessage = document.getElementById("modal-message");

  modal.style.display = "flex";

  if (board[r][c] == playerRed) {
    modalTitle.innerHTML = "Red wins!";
    modalMessage.innerHTML = "Congratulations! 🎉";
  } else {
    modalTitle.innerHTML = "Yellow wins!";
    modalMessage.innerHTML = "Congratulations! 🎉";
  }

  gameOver = true;
}

function randomPlayer() {
  return Math.floor(Math.random() * 2) === 0 ? playerRed : playerYellow;
}

function shadeColor(color, percent) {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);
  
    R = parseInt((R * (100 + percent)) / 100);
    G = parseInt((G * (100 + percent)) / 100);
    B = parseInt((B * (100 + percent)) / 100);
  
    R = R < 255 ? R : 255;
    G = G < 255 ? G : 255;
    B = B < 255 ? B : 255;
  
    const RR =
      R.toString(16).length === 1 ? "0" + R.toString(16) : R.toString(16);
    const GG =
      G.toString(16).length === 1 ? "0" + G.toString(16) : G.toString(16);
    const BB =
      B.toString(16).length === 1 ? "0" + B.toString(16) : B.toString(16);
  
    return `#${RR}${GG}${BB}`;
  }
  