const fields = document.querySelectorAll(".game__field");
const results = document.querySelector(".game__results");
const turn = document.querySelector(".game__turn");
let player = 1;
let player1fields = [];
let player2fields = [];
let winner = 0;
let available_cells = [99, 98, 97, 96, 95, 94, 93, 92, 91, 90];

let availableCombs = [];
let bestCombs = [];

const winCombs = [];

const createCombs = function (stepLimit, stepDiff, diagStart = 0, diagEnd = 0) {
  for (let y = 0; y <= 9 - diagEnd; y += 1) {
    for (let x = 0 + diagStart; x < 7 + diagStart; x++) {
      let win = [];
      for (let n = 0; n < stepLimit; n += stepDiff) {
        win.push(y * 10 + x + n);
      }
      winCombs.push(win);
    }
  }
};

createCombs(4, 1);
createCombs(40, 10, 0);
createCombs(44, 11, 0, 3);
createCombs(36, 9, 3, 3);
const showAvailable = function () {
  fields.forEach((field) => {
    field.classList.remove("available");
  });
  for (let avail of available_cells) {
    fields[avail].classList.add("available");
  }
};
showAvailable();

const reset = function (evt) {
  location.reload();
};
const change = function () {
  if (player == 1) {
    player = 2;
  } else if (player == 2) {
    player = 1;
  }
  turn.textContent = player;
  showAvailable();
};

const fill = function () {
  if (player == 1) {
    return "X";
  } else if (player == 2) {
    return "O";
  } else return "";
};

const winCheck = function () {
  if (player == 1) {
    let counter = 0;
    for (let comb of winCombs) {
      counter = 0;
      for (let value of comb) {
        if (player1fields.includes(value)) {
          counter++;
        }
        if (counter == 4) {
          winComb = comb;
          console.log(winComb);
          winner = 1;
        }
      }
    }
  } else if (player == 2) {
    let counter = 0;
    for (let comb of winCombs) {
      counter = 0;
      for (let value of comb) {
        if (player2fields.includes(value)) {
          counter++;
        }
        if (counter == 4) {
          winComb = comb;
          winner = 2;
        }
      }
    }
  }
  if (winner > 0) {
    results.innerText = "Winner is player " + winner;
    player = 0;
    for (let value of winComb) {
      fields[value].classList.add("comb");
    }
  }
};
// bot random step on available cells
// const botTurn = function () {
//   if (player == 2) {
//     const randField = Math.floor(Math.random() * available_cells.length);
//     fields[available_cells[randField]].click();
//   }
// };
const botTurn = function () {
  if (player == 2) {
    botDecision();
  }
};

const checkCombos = function () {
  for (let combIndex in winCombs) {
    let counter = 0;
    for (let cell of player1fields) {
      if (winCombs[combIndex].includes(cell)) {
        counter++;
      }
    }
    bestCombs.push({ cell: combIndex, rating: counter });
  }
  bestCombs.sort(function (a, b) {
    return b.rating - a.rating;
  });
};

const botDecision = function () {
  for (let comb of bestCombs) {
    for (let avail of available_cells) {
      if (winCombs[comb.cell].includes(avail)) {
        fields[avail].click();
      }
    }
  }
};

fields.forEach((el, index) => {
  el.onclick = function (evt) {
    if (!this.firstChild.innerText && available_cells.includes(index)) {
      if (player == 1) {
        player1fields.push(index);
        checkCombos();
      } else if (player == 2) {
        player2fields.push(index);
      }
      this.firstChild.innerText = fill();
      available_cells.push(index - 10);
      available_cells.splice(available_cells.indexOf(index), 1);

      winCheck();
      change();
      botTurn();
    }
  };
});
