import Character from './character';
import Rat from './rat'
import './style.scss'

class Game {
  board: HTMLElement;
  score: number;
  character?: Character;
  interval?: number;
  rats: Rat[];
  timeActive: number;
  timeToSpawn: number;
  refreshTime: number = 100;
  upKeyActive: boolean = false;
  downKeyActive: boolean = false;
  leftKeyActive: boolean = false;
  rightKeyActive: boolean = false;

  constructor() {
    this.board = document.getElementById("game-board")!;
    this.score = 0;
    this.timeActive = 0;
    this.timeToSpawn = 5000;
    this.rats = [];
  }

  startGame = () => {
    this.score = 0;
    this.timeActive = 0;
    this.character = new Character(this.board);
    this.timeToSpawn = 5000;
    this.rats = [];
    this.board.classList.remove("start");
    this.board.classList.add("running");
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    this.board.addEventListener("click", this.onClick);
    this.interval = window.setInterval(() => this.updateState(), this.refreshTime);
  }

  endGame = () => {
    clearInterval(this.interval);
    this.board.querySelectorAll(".rat").forEach((rat) => rat.remove());
    this.board.querySelector(".character")?.remove();
    this.board.classList.remove("running");
    this.board.classList.add("end");
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
  }

  restartGame = () => {
    this.board = document.getElementById("game-board")!;
    this.board.classList.remove("start");
    this.board.classList.remove("end");
    this.board.classList.add("running");
    this.upKeyActive = false;
    this.downKeyActive = false;
    this.leftKeyActive = false;
    this.rightKeyActive = false;
    this.board.querySelectorAll(".rat").forEach((rat) => rat.remove());
    this.board.querySelector(".character")?.remove();
    this.score = 0;
    this.timeActive = 0;
    this.character = new Character(this.board);
    this.timeToSpawn = 5000;
    this.rats = [];
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    this.board.addEventListener("click", this.onClick);
    this.interval = window.setInterval(() => this.updateState(), this.refreshTime);
  }

  onKeyDown = (e: KeyboardEvent) => {
    this.upKeyActive = this.upKeyActive || e.key === "ArrowUp" || e.key === "w";
    this.downKeyActive = this.downKeyActive || e.key === "ArrowDown" || e.key === "s";
    this.leftKeyActive = this.leftKeyActive || e.key === "ArrowLeft" || e.key === "a";
    this.rightKeyActive = this.rightKeyActive || e.key === "ArrowRight" || e.key === "d";
  }

  onKeyUp = (e: KeyboardEvent) => {
    if ( e.key === "ArrowUp" || e.key === "w"){
      this.upKeyActive = false;
    } else if (e.key === "ArrowDown" || e.key === "s"){
      this.downKeyActive = false;
    } else if (e.key === "ArrowLeft" || e.key === "a"){
      this.leftKeyActive = false;
    } else if (e.key === "ArrowRight" || e.key === "d"){
      this.rightKeyActive = false;
    }
  }

  onClick = (e: MouseEvent) => {
    let ratToRemove: number = -1;
    const board = this.board.getBoundingClientRect();
    const x = e.clientX - board.left; //x position within the element.
    const y = board.height - (e.clientY - board.top);  //y position within the element.
    console.log("X? : " + x + " ; Y? : " + y + ".");
    for (let i = 0; i < this.rats.length; i++) {
      const rat = this.rats[i];
      const isHit = rat.isHit(x, y, this.character!.xPosition + this.character!.width / 2, this.character!.yPosition + this.character!.height / 2);
      if (isHit) {
        const isDead = rat.isDead();
        if (isDead) {
          rat.remove();
          this.score += 1;
          ratToRemove = i;
          break;
        }
      }
    }
    if (ratToRemove > -1) {
      this.rats.splice(ratToRemove, 1);
    }
  }

  updateState = () => {
    this.timeActive += this.refreshTime;
    if (this.timeActive >= this.timeToSpawn) {
      this.rats.push(new Rat(this.board));
      this.timeToSpawn = this.timeActive + Math.ceil(Math.random() * 10000);
    }
    this.rats.forEach((rat) => {
      rat.move(this.character!);
    });
    this.character?.move(this.upKeyActive, this.downKeyActive, this.leftKeyActive, this.rightKeyActive);
    if (this.character?.isDead()) {
      this.endGame();
    }
  }
}

const game = new Game();

window.startGame = game.startGame;

window.restartGame = game.restartGame;
