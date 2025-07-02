function openFourGame() {
  const modal = document.createElement("div");

  const header = document.createElement("div");
  header.classList.add("game-modal-header");

  const infoMessage = document.createElement("p");
  infoMessage.innerHTML =
    translations["game.current"] + "<span id='four-info'></span>";
  infoMessage.id = "four-info-wrapper";

  header.appendChild(infoMessage);

  modal.appendChild(header);

  const board = document.createElement("div");
  board.id = "four-board";

  modal.appendChild(board);

  openModal("Four in a Row", modal);

  startFourGame();
}

function stopFourGame() {
  if (!fourRunning) return;

  gameOver = false;
  fourRunning = false;
  board = undefined;
  currColumns = undefined;
  currPlayer = undefined;
}

var fourRunning = false;

var playerRed = "R";
var playerYellow = "Y";
var currPlayer;

var gameOver = false;
var board;
var currColumns;

var fourRows = 6;
var fourColumns = 7;

function startFourGame() {
  fourRunning = true;

  currPlayer = randomPlayer();
  if (currPlayer == playerRed) {
    document.getElementById("four-info").innerHTML =
      "🔴 " + translations["game.four.red"];
  } else {
    document.getElementById("four-info").innerHTML =
      "🟡 " + translations["game.four.yellow"];
  }

  board = [];
  currColumns = [5, 5, 5, 5, 5, 5, 5];

  for (let r = 0; r < fourRows; r++) {
    let row = [];

    for (let c = 0; c < fourColumns; c++) {
      row.push(" ");

      let title = document.createElement("div");
      title.id = r.toString() + "-" + c.toString();
      title.classList.add("tile");
      title.addEventListener("click", setPiece);

      document.getElementById("four-board").appendChild(title);
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
    tile.innerHTML = `<div style="width: 50%; height: 50%; background-color: ${shadeColor(
      "#ff4d4d",
      -10
    )}; border-radius: 50%;"></div>`;

    currPlayer = playerYellow;
    document.getElementById("four-info").innerHTML =
      "🟡 " + translations["game.four.yellow"];
  } else {
    tile.classList.add("yellow");
    tile.innerHTML = `<div style="width: 50%; height: 50%; background-color: ${shadeColor(
      "#ffdb4d",
      -10
    )}; border-radius: 50%;"></div>`;

    currPlayer = playerRed;
    document.getElementById("four-info").innerHTML =
      "🔴 " + translations["game.four.red"];
  }

  r -= 1;
  currColumns[c] = r;

  checkWinner();
}

function checkWinner() {
  for (let r = 0; r < fourRows; r++) {
    for (let c = 0; c < fourColumns - 3; c++) {
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

  for (let c = 0; c < fourColumns; c++) {
    for (let r = 0; r < fourRows - 3; r++) {
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

  for (let r = 0; r < fourRows - 3; r++) {
    for (let c = 0; c < fourColumns - 3; c++) {
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

  for (let r = 3; r < fourRows; r++) {
    for (let c = 0; c < fourColumns - 3; c++) {
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
  const info = document.getElementById("four-info-wrapper");

  if (board[r][c] == playerRed) {
    info.innerHTML =
      "<b>" +
      translations["game.over"] +
      " " +
      translations["game.winner"] +
      "<span id='four-info'>🔴 " +
      translations["game.four.red"] +
      "</span></b>";
  } else {
    info.innerHTML =
      "<b>" +
      translations["game.over"] +
      " " +
      translations["game.winner"] +
      "<span id='four-info'>🟡 " +
      translations["game.four.yellow"] +
      "</span></b>";
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
