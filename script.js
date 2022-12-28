const GameBoard = (() => {
  const board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  let cellsFilled = 0;

  function checkWinner() {
    for (let i = 0; i < 3; i++) {
      if (
        board[i][0] !== "" &&
        board[i][0] == board[i][1] &&
        board[i][1] == board[i][2]
      )
        return true;
    }

    for (let i = 0; i < 3; i++) {
      if (
        board[0][i] !== "" &&
        board[0][i] == board[1][i] &&
        board[1][i] == board[2][i]
      )
        return true;
    }

    if (
      board[0][0] !== "" &&
      board[0][0] == board[1][1] &&
      board[1][1] == board[2][2]
    )
      return true;
    else if (
      board[0][2] !== "" &&
      board[0][2] == board[1][1] &&
      board[1][1] == board[2][0]
    )
      return true;
    else return false;
  }

  function move(row, col, mark) {
    board[row][col] = mark;
    cellsFilled++;
  }

  function reset() {
    cellsFilled = 0;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        board[i][j] = "";
      }
    }
  }

  function getCellsFilled() {
    return cellsFilled;
  }

  return {
    move,
    checkWinner,
    reset,
    getCellsFilled,
  };
})();

function playerFactory(name, mark) {
  function getName() {
    return name;
  }
  function getMark() {
    return mark;
  }
  return {
    getName,
    getMark,
  };
}

const GameController = (() => {
  let isGameOver = false;
  const player1 = playerFactory("Player 1", "X");
  const player2 = playerFactory("Player 2", "O");
  let activePlayer = player1;

  function switchPlayers() {
    activePlayer = activePlayer === player1 ? player2 : player1;
    DisplayController.displayMessage(`${activePlayer.getName()}'s turn`);
  }

  function makeMove(i, j, cell) {
    GameBoard.move(i, j, activePlayer.getMark());
    DisplayController.setMark(cell, activePlayer.getMark());
    if (GameBoard.checkWinner()) {
      DisplayController.displayMessage(`${activePlayer.getName()} wins!`);
      isGameOver = true;
    } else if (GameBoard.getCellsFilled() === 9) {
      DisplayController.displayMessage(`It's a tie!`);
      isGameOver = true;
    } else {
      switchPlayers();
    }
  }

  function isOver() {
    return isGameOver;
  }

  function reset() {
    activePlayer = player1;
    isGameOver = false;
    DisplayController.displayMessage(`${activePlayer.getName()}'s turn`);
  }

  return {
    makeMove,
    isOver,
    reset,
  };
})();

const DisplayController = (() => {
  const gameInfo = document.querySelector(".game-info");
  const boardCells = document.querySelectorAll(".cell");
  const restartBtn = document.querySelector(".restart");

  boardCells.forEach((cell) => {
    cell.addEventListener("click", () => {
      if (GameController.isOver() || cell.textContent !== "") return;
      const row = +cell.dataset.row;
      const col = +cell.dataset.col;
      GameController.makeMove(row, col, cell);
    });
  });

  restartBtn.addEventListener("click", () => {
    GameBoard.reset();
    GameController.reset();
    boardCells.forEach((cell) => {
      cell.textContent = "";
    });
  });

  function displayMessage(message) {
    gameInfo.textContent = message;
  }

  function setMark(cell, mark) {
    cell.textContent = mark;
  }

  return {
    displayMessage,
    setMark,
  };
})();
