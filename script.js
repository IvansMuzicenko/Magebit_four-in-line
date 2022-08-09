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

const createCombs = function (stepDiff, diagStart = 0) {
  let xlimit = 10;
  let ylimit = 10;
  if (stepDiff == 1) {
    xlimit = 7;
  } else if (stepDiff == 10) {
    ylimit = 7;
  } else if (stepDiff == 11) {
    ylimit = 7;
    xlimit = 7;
  } else if (stepDiff == 9) {
    ylimit = 7;
  }
  for (let y = 0; y < ylimit; y += 1) {
    for (let x = 0 + diagStart; x < xlimit; x++) {
      let win = [];
      for (let n = 0; n < 4; n += 1) {
        win.push(y * 10 + x + n * stepDiff);
      }
      winCombs.push(win);
    }
  }
};

createCombs(1);
createCombs(10);
createCombs(11);
createCombs(9, 3);
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
    bestCombs.push({ index: combIndex, rating: counter });
  }
  for (let comb of bestCombs) {
    for (let blocked of player2fields) {
      if (winCombs[comb.index].includes(blocked)) {
        bestCombs = bestCombs.filter((el) => {
          return el.index != comb.index;
        });
      }
    }
  }

  bestCombs.sort(function (a, b) {
    return b.rating - a.rating;
  });
};

const botDecision = function () {
  for (let comb of bestCombs) {
    for (let avail of available_cells) {
      if (winCombs[comb.index].includes(avail)) {
        return fields[avail].click();
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
      available_cells.push(index - (index >= 10 ? 10 : 0));
      available_cells.splice(available_cells.indexOf(index), 1);

      winCheck();
      change();
      botTurn();
    }
  };
});
