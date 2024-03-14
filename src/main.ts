import Character from './character';
import Rat from './rat'
import './style.scss'

class Game {
  boardCanvas: HTMLCanvasElement;
  board: HTMLElement;
  score: number;
  character?: Character;
  interval?: number;
  rats: Rat[];
  timeActive: number;
  timeToSpawn: number;
  refreshTime: number = 100;
  shotTimeoutActive: boolean = false;
  upKeyActive: boolean = false;
  downKeyActive: boolean = false;
  leftKeyActive: boolean = false;
  rightKeyActive: boolean = false;

  constructor() {
    this.board = document.getElementById("game-board")!;
    this.boardCanvas = document.getElementById("game-canvas") as HTMLCanvasElement;
    this.boardCanvas.width = this.board.clientWidth;
    this.boardCanvas.height = this.board.clientHeight;
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
    this.board.removeEventListener("click", this.onClick);
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
    if (!this.shotTimeoutActive) {
      this.shotTimeoutActive = true;
      let ratToRemove: number = -1;
      const board = this.board.getBoundingClientRect();
      const x = e.clientX - board.left; //x position within the element.
      const y = board.height - (e.clientY - board.top);  //y position within the element.
      const characterX = this.character!.xPosition + this.character!.width / 2;
      const characterY = this.character!.yPosition + this.character!.height / 2;
      let hitPoint: [number, number] | null = null;
      for (let i = 0; i < this.rats.length; i++) {
        const rat = this.rats[i];
        hitPoint = rat.isHit(characterX, characterY, x, y);
        if (hitPoint) {
          this.animateShot(characterX, characterY, hitPoint[0], hitPoint[1])
          const isDead = rat.isDead();
          if (isDead) {
            rat.remove();
            this.score += 1;
            ratToRemove = i;
            break;
          }
        }
      }
      if (!hitPoint) {
        const angleOfShot = Math.atan2(y - characterY, x - characterX);
        const x1 = characterX + Math.cos(angleOfShot) * 500;
        const y1 = characterY + Math.sin(angleOfShot) * 500;
        this.animateShot(characterX, characterY, x1, y1)
      }
      if (ratToRemove > -1) {
        this.rats.splice(ratToRemove, 1);
      }
    }
  }

  animateShot(x0: number, y0: number, x1: number, y1: number) {
    const correctedY0 = this.boardCanvas.getBoundingClientRect().height - y0;
    const correctedY1 = this.boardCanvas.getBoundingClientRect().height - y1;
    const shot = this.boardCanvas.getContext("2d");
    console.log("x0:" + x0 + " y0:" + correctedY0 + " x1:" + x1 + " y1:" + correctedY1)
    shot?.beginPath();
    shot?.moveTo(x0, correctedY0);
    shot?.lineTo(x1, correctedY1);
    shot?.stroke()
    setTimeout(() => {
      this.shotTimeoutActive = false;
      shot?.clearRect(0, 0, this.boardCanvas.width, this.boardCanvas.height);
    }, 100);
  }

  updateState = () => {
    this.timeActive += this.refreshTime;
    if (this.timeActive >= this.timeToSpawn) {
      this.rats.push(new Rat(this.board));
      this.timeToSpawn = this.timeActive + Math.ceil(Math.random() * (5000 - 4500 * (1 - Math.exp(-this.timeActive / 10000))));
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
