'use strict';

class Game {
  static START_TILES_QUANTITY_DEFAULT = 2;
  static DEFAULT_BOARD = Array(4)
    .fill()
    .map(() => Array(4).fill(0));
  static MOVE_KEYS = Object.freeze([
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
  ]);
  static STATUS = Object.freeze({
    Idle: 'Idle',
    Playing: 'Playing',
    Lost: 'Lost',
    Won: 'Won',
  });

  status = Game.STATUS.Idle;
  score = 0;

  constructor(
    initialState = structuredClone(Game.DEFAULT_BOARD),
    startTilesAmount = Game.START_TILES_QUANTITY_DEFAULT,
  ) {
    this.state = initialState;
    this.startTilesAmount = startTilesAmount;
  }

  get size() {
    return this.state.length;
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.state;
  }

  getStatus() {
    return this.status;
  }

  move(key) {
    switch (key) {
      case 'ArrowUp':
        this.moveUp();
        break;
      case 'ArrowRight':
        this.moveRight();
        break;
      case 'ArrowDown':
        this.moveDown();
        break;
      case 'ArrowLeft':
        this.moveLeft();
        break;
    }
    this.placeNewTile();
    this.updateGameStatus();
  }

  handleMove() {
    for (let col = 0; col < this.size; col++) {
      const numbers = [];

      for (let row = 0; row < this.size; row++) {
        if (this.state[row][col] !== 0) {
          numbers.push(this.state[row][col]);
        }
      }

      const merged = [];
      let i = 0;

      while (i < numbers.length) {
        if (i + 1 < numbers.length && numbers[i] === numbers[i + 1]) {
          const stackedNumber = numbers[i] * 2;

          merged.push(stackedNumber);
          this.score += stackedNumber;
          i += 2;
        } else {
          merged.push(numbers[i]);
          i++;
        }
      }

      while (merged.length < this.size) {
        merged.push(0);
      }

      for (let row = 0; row < this.size; row++) {
        this.state[row][col] = merged[row];
      }
    }
  }

  moveUp() {
    this.handleMove();
  }

  moveDown() {
    this.reverseGrid();
    this.handleMove();
    this.reverseGrid();
  }

  moveLeft() {
    this.rotateClockwise();
    this.handleMove();
    this.rotateCounterClockwise();
  }

  moveRight() {
    this.rotateCounterClockwise();
    this.handleMove();
    this.rotateClockwise();
  }

  reverseGrid() {
    this.state.reverse();
  }

  transpose() {
    for (let i = 0; i < this.size; i++) {
      for (let j = i + 1; j < this.size; j++) {
        [this.state[i][j], this.state[j][i]] = [
          this.state[j][i],
          this.state[i][j],
        ];
      }
    }
  }

  rotateClockwise() {
    this.transpose();
    this.state.forEach((row) => row.reverse());
  }

  rotateCounterClockwise() {
    this.state.forEach((row) => row.reverse());
    this.transpose();
  }

  updateGameStatus() {
    if (this.checkMovePossibility()) {
      return;
    }
    this.status = Game.STATUS.Lost;

    for (const row of this.state) {
      if (row.includes(2048)) {
        this.status = Game.STATUS.Won;

        return;
      }
    }
  }

  start() {
    this.status = Game.STATUS.Playing;

    for (let i = 0; i < this.startTilesAmount; i++) {
      this.placeNewTile();
    }
  }

  restart() {
    this.status = Game.STATUS.Idle;
    this.state = structuredClone(Game.DEFAULT_BOARD);
    this.score = 0;
    this.start();
  }

  getTwoOrFour() {
    return Math.random() < 0.9 ? 2 : 4;
  }

  placeNewTile() {
    const emptyCells = [];

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.state[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomCellIndex = Math.floor(Math.random() * emptyCells.length);
      const { row, col } = emptyCells[randomCellIndex];

      this.state[row][col] = this.getTwoOrFour();
    }
  }

  checkMovePossibility() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.state[row][col] === 0) {
          return true;
        }
      }
    }

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size - 1; col++) {
        if (this.state[row][col] === this.state[row][col + 1]) {
          return true;
        }
      }
    }

    for (let col = 0; col < this.size; col++) {
      for (let row = 0; row < this.size - 1; row++) {
        if (this.state[row][col] === this.state[row + 1][col]) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
