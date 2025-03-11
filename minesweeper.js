function openMinesweeperGame() {
  const modal = document.createElement("div");

  const header = document.createElement("div");
  header.classList.add("game-modal-header");

  const infoMessage = document.createElement("p");
  infoMessage.id = "minesweeper-info";

  const pillWrapper = document.createElement("div");
  pillWrapper.classList.add("game-pill-wrapper");

  const timePill = document.createElement("div");
  timePill.classList.add("pill");
  timePill.innerHTML = "💣 <span id='minesweeper-mines'>0</span>";

  const errorPill = document.createElement("div");
  errorPill.classList.add("pill");
  errorPill.innerHTML = "🚩 <span id='minesweeper-flags'>0</span>";

  pillWrapper.appendChild(timePill);
  pillWrapper.appendChild(errorPill);

  header.appendChild(infoMessage);
  header.appendChild(pillWrapper);

  modal.appendChild(header);

  const board = document.createElement("div");
  board.id = "minesweeper-grid";

  modal.appendChild(board);

  openModal("Minesweeper", modal);

  startMinesweeperGame();
}

function stopMinesweeperGame() {
  if (!mineRunning) return;

  running = false;
  gameOver = false;
  mineTilesClicked = 0;
  flagBtnToggle = false;
  flagCount = 0;
  minesLocation = [];
  minesCount = 10;
  mineBoard = [];
  mineRows = 0;
  mineColumns = 0;
}

var mineBoard = [];
var mineRows = 0;
var mineColumns = 0;

var minesCount = 10;
var minesLocation = [];

var mineTilesClicked = 0;
var flagBtnToggle = false;
var flagCount = 0;

var mineRunning = false;
var gameOver = false;

function startMinesweeperGame() {
  mineRunning = true;

  if(window.innerWidth < 540) {
    minesCount = 8;
  }

  createGrid(50);
  setMines();

  document.getElementById("minesweeper-mines").innerText = minesCount;
}

function createGrid(elementSize) {
  const container = document.getElementById("minesweeper-grid");
  container.innerHTML = ""; // Clear previous grid
  container.style.display = "grid";

  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;

  mineColumns = Math.floor(containerWidth / elementSize);
  mineRows = Math.floor(containerHeight / elementSize);

  container.style.gridTemplateRows = `repeat(${mineRows}, ${elementSize}px)`;
  container.style.gridTemplateColumns = `repeat(${mineColumns}, ${elementSize}px)`;

  // Create grid elements with chessboard colors
  for (let i = 0; i < mineRows; i++) {
    let row = [];

    for (let j = 0; j < mineColumns; j++) {
      const cell = document.createElement("div");
      cell.style.width = `${elementSize}px`;
      cell.style.height = `${elementSize}px`;
      cell.style.backgroundColor = (i + j) % 2 === 0 ? "#aad751" : "#a2d149";
      cell.id = i.toString() + "-" + j.toString();
      cell.addEventListener("click", clickTile);
      cell.addEventListener("contextmenu", rightClickTile);
      cell.addEventListener("contextmenu", (event) => event.preventDefault());

      container.appendChild(cell);

      row.push(cell);
    }
    mineBoard.push(row);
  }
}

function setMines() {
  let minesLeft = minesCount;

  while (minesLeft > 0) {
    let r = Math.floor(Math.random() * mineRows);
    let c = Math.floor(Math.random() * mineColumns);
    let id = r.toString() + "-" + c.toString();

    if (!minesLocation.includes(id)) {
      minesLocation.push(id);
      minesLeft--;
    }
  }
}

function toggleFlag() {
  flagBtnToggle = !flagBtnToggle;

  // document.getElementById("flag-btn").classList.toggle("active");
}

function rightClickTile() {
  let tile = this;

  if (gameOver || this.classList.contains("tile-clicked")) {
    return;
  }

  if (tile.innerText == "") {
    tile.innerText = "🚩";
    flagCount++;
    document.getElementById("minesweeper-flags").innerText = flagCount;
  } else if (tile.innerText == "🚩") {
    tile.innerText = "";
    flagCount--;
    document.getElementById("minesweeper-flags").innerText = flagCount;
  }
}

function clickTile() {
  let tile = this;

  if (gameOver || this.classList.contains("tile-clicked")) {
    return;
  }

  if (flagBtnToggle) {
    rightClickTile.call(tile);
    return;
  }

  if (mineTilesClicked == 0 && minesLocation.includes(tile.id)) {
    minesLocation = minesLocation.filter((mine) => mine !== tile.id);
    setMines();
  }

  if (minesLocation.includes(tile.id)) {
    gameOver = true;

    document.getElementById("minesweeper-info").innerHTML =
      "<b>" + translations["game.minesweeper.lost"] + "</b>";

    revealMines();
    return;
  }

  let coords = tile.id.split("-");
  let r = parseInt(coords[0]);
  let c = parseInt(coords[1]);
  checkMine(r, c);
}

function revealMines() {
  for (let r = 0; r < mineRows; r++) {
    for (let c = 0; c < mineColumns; c++) {
      let tile = mineBoard[r][c];
      if (minesLocation.includes(tile.id)) {
        const colors = ["#008744", "#f4c20d", "#db3236", "#48e6f1"];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const darkerColor = shadeColor(randomColor, -20);

        tile.innerText = "💣";
        tile.style.backgroundColor = randomColor;
        tile.innerHTML = `<div style="width: 50%; height: 50%; background-color: ${darkerColor}; border-radius: 50%;"></div>`;
      }
    }
  }
}

function checkMine(r, c) {
  if (r < 0 || r >= mineRows || c < 0 || c >= mineColumns) {
    return;
  }

  if (mineBoard[r][c].classList.contains("tile-clicked")) {
    return;
  }

  mineBoard[r][c].classList.add("tile-clicked");
  mineBoard[r][c].style.backgroundColor =
    (r + c) % 2 === 0 ? "#e5c29f" : "#d7b899";
  mineTilesClicked++;

  let minesFound = 0;

  minesFound += checkTile(r - 1, c - 1);
  minesFound += checkTile(r - 1, c);
  minesFound += checkTile(r - 1, c + 1);

  minesFound += checkTile(r, c - 1);
  minesFound += checkTile(r, c + 1);

  minesFound += checkTile(r + 1, c - 1);
  minesFound += checkTile(r + 1, c);
  minesFound += checkTile(r + 1, c + 1);

  if (minesFound > 0) {
    if (mineBoard[r][c].innerText == "🚩") {
      flagCount--;
      document.getElementById("minesweeper-flags").innerText = flagCount;
    }

    mineBoard[r][c].innerText = minesFound;
    mineBoard[r][c].classList.add("x" + minesFound.toString());
  } else {
    checkMine(r - 1, c - 1);
    checkMine(r - 1, c);
    checkMine(r - 1, c + 1);

    checkMine(r, c - 1);
    checkMine(r, c + 1);

    checkMine(r + 1, c - 1);
    checkMine(r + 1, c);
    checkMine(r + 1, c + 1);
  }

  if (mineTilesClicked == mineRows * mineColumns - minesCount) {
    document.getElementById("minesweeper-info").innerHTML =
      "<b>" + translations["game.win"] + "</b>";

    gameOver = true;
  }
}

function checkTile(r, c) {
  if (r < 0 || r >= mineRows || c < 0 || c >= mineColumns) {
    return 0;
  }

  if (minesLocation.includes(r.toString() + "-" + c.toString())) {
    return 1;
  }

  return 0;
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
