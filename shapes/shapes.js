function openShapesGame() {
  const modal = document.createElement("div");

  const header = document.createElement("div");
  header.classList.add("game-modal-header");

  const infoMessage = document.createElement("p");
  infoMessage.id = "shapes-info";

  const pillWrapper = document.createElement("div");
  pillWrapper.classList.add("game-pill-wrapper");

  const timePill = document.createElement("div");
  timePill.classList.add("pill");
  timePill.innerHTML =
    "🕑 <span id='shapes-minutes'>00</span>:<span id='shapes-seconds'>00</span> min";

  const errorPill = document.createElement("div");
  errorPill.classList.add("pill");
  errorPill.innerHTML = "❌ <span id='shapes-error'>0</span>";

  pillWrapper.appendChild(timePill);
  pillWrapper.appendChild(errorPill);

  header.appendChild(infoMessage);
  header.appendChild(pillWrapper);

  modal.appendChild(header);

  const board = document.createElement("div");
  board.id = "shapes-board";

  modal.appendChild(board);

  openModal("Shapes", modal);

  shuffleCards();
  startShapesGame();
}

function stopShapesGame() {
  if (!shapesRunning) return;

  clearInterval(timer);

  gameOver = false;
  shapesRunning = false;
  time = 0;
  timer = undefined;
  card1Selected = undefined;
  card2Selected = undefined;
  cardSet = undefined;
  shapesBoard = [];
  errors = 0;
}

const cardsPath = "assets/images/games/shapes-cards/";

var shapesRunning = false;

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
var shapesBoard = [];

var shapesRows = 4;
var shapesColumns = 5;

var card1Selected;
var card2Selected;

var time = 0;
var timer;
var gameOver = false;

function shuffleCards() {
  cardSet = cardList.concat(cardList);

  for (let i = 0; i < cardSet.length; i++) {
    let j = Math.floor(Math.random() * cardSet.length);

    let temp = cardSet[i];
    cardSet[i] = cardSet[j];
    cardSet[j] = temp;
  }
}

function startShapesGame() {
  shapesRunning = true;

  startShapesTimer();

  for (let r = 0; r < shapesRows; r++) {
    let row = [];

    for (let c = 0; c < shapesColumns; c++) {
      let cardImg = cardSet.pop();
      row.push(cardImg);

      let card = document.createElement("img");
      card.id = r.toString() + "-" + c.toString();
      card.src = cardsPath + cardImg + ".png";
      card.classList.add("shapes-card");
      card.addEventListener("click", selectCard);

      document.getElementById("shapes-board").appendChild(card);
    }
    shapesBoard.push(row);
  }
  
  hideCards();
}

function hideCards() {
  for (let r = 0; r < shapesRows; r++) {
    for (let c = 0; c < shapesColumns; c++) {
      let card = document.getElementById(r.toString() + "-" + c.toString());
      card.src = cardsPath + "back.png";
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

      card1Selected.src = cardsPath + shapesBoard[r][c] + ".png";
    } else if (!card2Selected && this !== card1Selected) {
      card2Selected = this;

      let coords = card2Selected.id.split("-");
      let r = parseInt(coords[0]);
      let c = parseInt(coords[1]);

      card2Selected.src = cardsPath + shapesBoard[r][c] + ".png";

      setTimeout(update, 1000);
    }
  }
}

function update() {
  if (card1Selected.src != card2Selected.src) {
    card1Selected.src = cardsPath + "back.png";
    card2Selected.src = cardsPath + "back.png";

    errors++;

    document.getElementById("shapes-error").innerText = errors;
  } else {
    checkForWin();
  }

  card1Selected = null;
  card2Selected = null;
}

function startShapesTimer() {
  timer = setInterval(function () {
    time++;

    let minutes = Math.floor(time / 60);
    let seconds = time % 60;

    document.getElementById("shapes-minutes").innerText = minutes
      .toString()
      .padStart(2, "0");
    document.getElementById("shapes-seconds").innerText = seconds
      .toString()
      .padStart(2, "0");
  }, 1000);
}

function checkForWin() {
  let win = true;

  for (let r = 0; r < shapesRows; r++) {
    for (let c = 0; c < shapesColumns; c++) {
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
    clearInterval(timer);

    document.getElementById("shapes-info").innerHTML = "<b>" + translations["game.win"] + "</b>";
  }
}
