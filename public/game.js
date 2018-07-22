const gameOfLife = {
  width: 60,
  height: 25,
  stepInterval: null,
  stepRate: 80,

  // Utility functions
  forEachCell: function(iteratorFunc) {


      Array.from(document.getElementsByTagName('td')).forEach(cell => {
          const coords = this.getCoordsOfCell(cell);
          iteratorFunc(cell, coords[0], coords[1]);
      })
  },
  getCoordsOfCell: function(cell) {
      const idSplit = cell.id.split('-'); // ['0', '0']
      return idSplit.map(str => +str)
  },
  getCellStatus: function(cell) {
      return cell.getAttribute('data-status');
  },
  setCellStatus: function(cell, status) {
      cell.className = status;
      return cell.setAttribute('data-status', status)
  },
  toggleCellStatus: function(cell) {
      if (this.getCellStatus(cell) == 'dead') {
          this.setCellStatus(cell, "alive");
      } else {
          this.setCellStatus(cell, "dead");
      }
  },
  getNeighbors: function (cell) {
      const neighbors = [];
      const [cellX, cellY] = this.getCoordsOfCell(cell);
      for (let i = cellX - 1; i <= cellX + 1; i++) {
          for (let j = cellY - 1; j <= cellY + 1; j++) {
              if (i === cellX && j === cellY) continue;
              neighbors.push(document.getElementById(`${i}-${j}`));
          }
      }
      return neighbors.filter(neighbor => neighbor);
  },
  getAliveNeighbors: function (cell) {
      var allNeighbors = this.getNeighbors(cell);
      return allNeighbors.filter(neighbor => this.getCellStatus(neighbor) === "alive");
  },

  // Game
  createAndShowBoard: function() {
      // create <table> body
      const goltable = document.createElement("tbody");

      // build Table HTML
      let tablehtml = '';
      for (let h = 0; h < this.height; h++) {

          // es6 Template Literals allow embedded expressions : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
          tablehtml += `<tr id='row+${h}'>`;
          for (let w = 0; w < this.width; w++) {
              tablehtml += `<td data-status='dead' id='${w}-${h}'></td>`;
          }
          tablehtml += "</tr>";
      }
      goltable.innerHTML = tablehtml;

      // add table to the #board element
      const board = document.getElementById('board');
      board.appendChild(goltable);

      // once html elements are added to the page, attach events to them
      this.setupBoardEvents();
  },
  setupBoardEvents: function() {
      // This function sets ups events for the entire board. Specifically onclick events!


      // Event Delegation allows us to set one onclick handler that bubbles up (propagates), and we can tell what was clicked by looking at event.target
        // https://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-flow-bubbling
      const onCellClick = e => this.toggleCellStatus(e.target);

      // if attaching click handler to board (event delegation!):
      document.getElementById('board').onclick = onCellClick;

      // Buttons
      document.getElementById("step_btn").onclick = () => this.step();
      document.getElementById("clear_btn").onclick= () => this.clearBoard();
      document.getElementById("reset_btn").onclick = () => this.resetRandom();
      document.getElementById("play_btn").onclick = () => this.enableAutoPlay();
      document.getElementById("step_input").onchange = () => this.onRateChange();

  },
  step: function() {

      const cellsToToggle = [];
      this.forEachCell((cell, x, y) => {
          const countLiveNeighbors = this.getAliveNeighbors(cell).length;
          if (this.getCellStatus(cell) === "alive") {
            if (countLiveNeighbors < 2 || countLiveNeighbors > 3) cellsToToggle.push(cell);
          } else if (countLiveNeighbors === 3) cellsToToggle.push(cell);
      })

      cellsToToggle.forEach((cellToToggle) => this.toggleCellStatus(cellToToggle))
  },
  clearBoard: function() {
      this.forEachCell((cell) => this.setCellStatus(cell, "dead"));
  },
  resetRandom: function() {
      this.forEachCell((cell) => this.setCellStatus(cell, Math.random() > .5 ? 'alive' : 'dead'))
  },
  enableAutoPlay: function() {
      if (this.stepInterval) return this.stopAutoPlay();
      this.stepInterval = setInterval(this.step.bind(this), this.stepRate);
  },
  stopAutoPlay: function() {
      clearInterval(this.stepInterval);
      this.stepInterval = null;
  },
  onRateChange: function() {
    this.stepRate = document.getElementById('step_input').value;
  }

};

gameOfLife.createAndShowBoard();
