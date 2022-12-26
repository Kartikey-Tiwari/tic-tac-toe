(() => {
  const activePlayerDOM = document.querySelector(".activePlayer");
  const info = document.querySelector(".game-info");

  function playerFactory(name, symbol) {
    return {
      name,
      symbol,
    };
  }

  const player1 = playerFactory("Player 1", "X");
  const player2 = playerFactory("Player 2", "O");
  let activePlayer = player1;

  function switchPlayers() {
    activePlayer = activePlayer === player1 ? player2 : player1;
  }

  const boardElement = document.querySelector(".board");
  const gameboard = (() => {
    let cellsFilled = 0;
    const board = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];

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
      if (board[row][col] === "") {
        board[row][col] = mark;
        cellsFilled++;
        return true;
      } else {
        return false;
      }
    }

    function reset() {
      keepPlaying = true;
      activePlayer = player1;
      cellsFilled = 0;
      activePlayerDOM.textContent = activePlayer.name;
      info.textContent = "'s turn";
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          board[i][j] = "";
        }
      }
      for (const el of boardElement.children) {
        el.textContent = "";
      }
    }

    return {
      move,
      checkWinner,
      reset,
      cellsFilled,
    };
  })();

  let keepPlaying = true;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const cell = document.createElement("div");
      cell.addEventListener("click", () => {
        if (!keepPlaying || gameboard.cellsFilled === 9) return;
        const moved = gameboard.move(i, j, activePlayer.symbol);
        if (moved) {
          cell.textContent = activePlayer.symbol;
          if (gameboard.checkWinner()) {
            keepPlaying = false;
            info.textContent = ` has won the game!`;
          } else {
            switchPlayers();
            activePlayerDOM.textContent = activePlayer.name;
          }
        }
      });

      cell.classList.add("cell");
      cell.style.height = "100px";
      if (i !== 0) cell.style.borderTop = "2px solid black";
      else cell.style.borderTop = "3px solid grey";
      if (j !== 0) cell.style.borderLeft = "2px solid black";
      else cell.style.borderLeft = "3px solid grey";
      if (i !== 2) cell.style.borderBottom = "2px solid black";
      else cell.style.borderBottom = "3px solid grey";
      if (j !== 2) cell.style.borderRight = "2px solid black";
      else cell.style.borderRight = "3px solid grey";
      boardElement.appendChild(cell);
    }
  }

  const restartBtn = document.querySelector(".restart");
  restartBtn.addEventListener("click", gameboard.reset);
})();
