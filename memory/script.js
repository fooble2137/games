var errors = 0;
var cardList = [
  "blue-c",
  "blue-s",
  "green-c",
  "green-s",
  "red-c",
  "red-s",
  "white-c",
  "white-s",
  "yellow-c",
  "yellow-s",
];

var cardSet;
var board = [];

var rows = 4;
var cols = 5;

var card1Selected;
var card2Selected;

var time = 0;
var gameOver = false;

window.onload = function () {
  shuffleCards();
  startGame();
};

function shuffleCards() {
  cardSet = cardList.concat(cardList);

  for (let i = 0; i < cardSet.length; i++) {
    let j = Math.floor(Math.random() * cardSet.length);

    let temp = cardSet[i];
    cardSet[i] = cardSet[j];
    cardSet[j] = temp;
  }
}

function startGame() {
  startTime();

  for (let r = 0; r < rows; r++) {
    let row = [];

    for (let c = 0; c < cols; c++) {
      let cardImg = cardSet.pop();
      row.push(cardImg);

      let card = document.createElement("img");
      card.id = r.toString() + "-" + c.toString();
      card.src = "cards/" + cardImg + ".png";
      card.classList.add("card");
      card.addEventListener("click", selectCard);

      document.getElementById("board").appendChild(card);
    }
    board.push(row);
  }
  setTimeout(hideCards, 500);
}

function hideCards() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let card = document.getElementById(r.toString() + "-" + c.toString());
      card.src = "cards/back.png";
    }
  }
}

function selectCard() {
  if (this.src.includes("back")) {
    if (!card1Selected) {
      card1Selected = this;

      let coords = card1Selected.id.split("-");
      let r = parseInt(coords[0]);
      let c = parseInt(coords[1]);

      card1Selected.src = "cards/" + board[r][c] + ".png";
    } else if (!card2Selected && this !== card1Selected) {
      card2Selected = this;

      let coords = card2Selected.id.split("-");
      let r = parseInt(coords[0]);
      let c = parseInt(coords[1]);

      card2Selected.src = "cards/" + board[r][c] + ".png";

      setTimeout(update, 1000);
    }
  }
}

function update() {
  if (card1Selected.src != card2Selected.src) {
    card1Selected.src = "cards/back.png";
    card2Selected.src = "cards/back.png";

    errors++;

    document.getElementById("error-count").innerText = errors;
  } else {
    checkForWin();
  }

  card1Selected = null;
  card2Selected = null;
}

function startTime() {
  setInterval(function () {
    time++;
    document.getElementById("time").innerText = time;

    if (gameOver) {
      clearInterval();
    }
  }, 1000);
}

function checkForWin() {
  let win = true;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (
        document
          .getElementById(r.toString() + "-" + c.toString())
          .src.includes("back")
      ) {
        win = false;
        break;
      }
    }
  }

  if (win) {
    gameOver = true;

    document.getElementById("modal").style.display = "flex";
    document.getElementById("modal-title").innerText = "You Win!";
    document.getElementById("modal-message").innerText = `Time: ${time}s`;
  }
}
