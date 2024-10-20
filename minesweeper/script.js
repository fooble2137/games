var board = [];
var rows = 0;
var columns = 0;

var minesCount;
var minesLocation = [];

var tilesClicked = 0;
var flagBtnToggle = false;
var flagCount = 0;

var gameOver = false;

document.addEventListener("DOMContentLoaded", function () {
  startGame(0);
});

function startGame(difficulty) {
  board = [];
  rows = 0;
  columns = 0;
  minesLocation = [];
  tilesClicked = 0;
  gameOver = false;
  flagCount = 0;

  switch (difficulty) {
    case 0:
      minesCount = 10;
      createGrid(50);
      break;
    case 1:
      minesCount = 50;
      createGrid(30);
      break;
    case 2:
      minesCount = 100;

      createGrid(25);
  }
  setMines();

  document.getElementById("mines-count").innerText = minesCount;
}

function setMines() {
  let minesLeft = minesCount;

  while (minesLeft > 0) {
    let r = Math.floor(Math.random() * rows);
    let c = Math.floor(Math.random() * columns);
    let id = r.toString() + "-" + c.toString();

    if (!minesLocation.includes(id)) {
      minesLocation.push(id);
      minesLeft--;
    }
  }
}

function createGrid(elementSize) {
  const container = document.getElementById("grid");
  container.innerHTML = ""; // Clear previous grid
  container.style.display = "grid";

  const containerSize = 500;
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  if (screenWidth < containerSize || screenHeight < containerSize) {
    columns = Math.floor((screenWidth * 0.9) / elementSize);
    rows = Math.floor((screenHeight * 0.9) / elementSize);
  } else {
    columns = Math.floor(containerSize / elementSize);
    rows = Math.floor(containerSize / elementSize);
  }

  container.style.gridTemplateRows = `repeat(${rows}, ${elementSize}px)`;
  container.style.gridTemplateColumns = `repeat(${columns}, ${elementSize}px)`;

  // Create grid elements with chessboard colors
  for (let i = 0; i < rows; i++) {
    let row = [];

    for (let j = 0; j < columns; j++) {
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
    board.push(row);
  }

  // Adjust grid size if screen is resized
  const adjustGridSize = () => {
    const newScreenWidth = window.innerWidth;
    const newScreenHeight = window.innerHeight;

    if (newScreenWidth < containerSize || newScreenHeight < containerSize) {
      columns = Math.floor((newScreenWidth * 0.9) / elementSize);
      rows = Math.floor((newScreenHeight * 0.9) / elementSize);
    } else {
      columns = Math.floor(containerSize / elementSize);
      rows = Math.floor(containerSize / elementSize);
    }

    container.style.gridTemplateRows = `repeat(${rows}, ${elementSize}px)`;
    container.style.gridTemplateColumns = `repeat(${columns}, ${elementSize}px)`;

    const totalCells = rows * columns;
    const currentCells = container.childNodes.length;

    if (totalCells > currentCells) {
      for (let i = currentCells; i < totalCells; i++) {
        const cell = document.createElement("div");
        cell.style.width = `${elementSize}px`;
        cell.style.height = `${elementSize}px`;
        cell.style.backgroundColor =
          (Math.floor(i / columns) + (i % columns)) % 2 === 0
            ? "#aad751"
            : "#a2d149";

        container.appendChild(cell);
      }
    } else if (totalCells < currentCells) {
      for (let i = currentCells - 1; i >= totalCells; i--) {
        container.removeChild(container.childNodes[i]);
      }
    }
  };

  window.addEventListener("resize", adjustGridSize);
  adjustGridSize();
}

function toggleDropdown() {
  document.getElementById("dropdown-content").classList.toggle("show");
}

function toggleFlag() {
  flagBtnToggle = !flagBtnToggle;

  document.getElementById("flag-btn").classList.toggle("active");
}

function setDifficulty(difficulty) {
  document.getElementById("easy").classList.toggle("selected", false);
  document.getElementById("normal").classList.toggle("selected", false);
  document.getElementById("hard").classList.toggle("selected", false);
  document.getElementById("dropdown-content").classList.toggle("show");

  switch (difficulty) {
    case 0:
      document.getElementById("dropbtn").innerText = "Easy ▾";
      document.getElementById("easy").classList.toggle("selected", true);

      startGame(0);
      break;
    case 1:
      document.getElementById("dropbtn").innerText = "Normal ▾";
      document.getElementById("normal").classList.toggle("selected", true);

      startGame(1);
      break;
    case 2:
      document.getElementById("dropbtn").innerText = "Hard ▾";
      document.getElementById("hard").classList.toggle("selected", true);

      startGame(2);
  }
}

function rightClickTile() {
  let tile = this;

  if (gameOver || this.classList.contains("tile-clicked")) {
    return;
  }

  if (tile.innerText == "") {
    tile.innerText = "🚩";
    flagCount++;
    document.getElementById("flags-count").innerText = flagCount;
  } else if (tile.innerText == "🚩") {
    tile.innerText = "";
    flagCount--;
    document.getElementById("flags-count").innerText = flagCount;
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

  if (minesLocation.includes(tile.id)) {
    gameOver = true;

    document.getElementById("modal").style.display = "flex";
    document.getElementById("modal-title").innerText = "Game Over!";
    document.getElementById("modal-message").innerText = "You have hit a mine";

    revealMines();
    return;
  }

  let coords = tile.id.split("-");
  let r = parseInt(coords[0]);
  let c = parseInt(coords[1]);
  checkMine(r, c);
}

function revealMines() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      let tile = board[r][c];
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
  if (r < 0 || r >= rows || c < 0 || c >= columns) {
    return;
  }

  if (board[r][c].classList.contains("tile-clicked")) {
    return;
  }

  board[r][c].classList.add("tile-clicked");
  board[r][c].style.backgroundColor = (r + c) % 2 === 0 ? "#e5c29f" : "#d7b899";
  tilesClicked++;

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
    if (board[r][c].innerText == "🚩") {
      flagCount--;
      document.getElementById("flags-count").innerText = flagCount;
    }

    board[r][c].innerText = minesFound;
    board[r][c].classList.add("x" + minesFound.toString());
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

  if (tilesClicked == rows * columns - minesCount) {
    document.getElementById("modal").style.display = "flex";
    document.getElementById("modal-title").innerText = "Congratulations!";
    document.getElementById("modal-message").innerText =
      "You have won the game";

    gameOver = true;
  }
}

function checkTile(r, c) {
  if (r < 0 || r >= rows || c < 0 || c >= columns) {
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
