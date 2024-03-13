
class Character {
    boardWidth: number;
    boardHeight: number;
    element: HTMLElement;
    xPosition: number;
    yPosition: number;
    width: number = 40;
    height: number = 40;
    speed: number = 5;
    lives: number = 1;

    constructor(boardElem: HTMLElement) {
        this.boardWidth = boardElem.clientWidth;
        this.boardHeight = boardElem.clientHeight;
        this.xPosition = Math.floor(boardElem.clientWidth / 2);
        this.yPosition = Math.floor(boardElem.clientHeight / 2);
        const div = document.createElement('div');
        div.style.width = this.width + "px";
        div.style.height = this.height + "px";
        div.style.left = this.xPosition + "px";
        div.style.bottom = this.yPosition + "px";
        div.classList.add('character');
        this.element = div;
        boardElem.appendChild(this.element);
    }

    characterCenterXPosition () {
        return this.xPosition + this.width / 2;
    }

    characterCenterYPosition () {
        return this.yPosition + this.height / 2;
    }

    move(upKeyActive: boolean, downKeyActive: boolean, leftKeyActive: boolean, rightKeyActive: boolean) {
        let xPos = 0;
        let yPos = 0;
        let move = false;
        if (leftKeyActive) {
            move = true;
            xPos -= 4;
        }
        if (rightKeyActive) {
            move = true;
            xPos += 4;
        }
        if (upKeyActive) {
            move = true;
            yPos += 4;
        }
        if (downKeyActive) {
            move = true;
            yPos -= 4;
        }
        if (move) {
            const angleRadians = Math.atan2(yPos, xPos);
            this.yPosition = Math.floor(Math.sin(angleRadians) * this.speed) + this.yPosition;
            this.xPosition = Math.floor(Math.cos(angleRadians) * this.speed) + this.xPosition;
            this.yPosition = Math.min(this.yPosition, this.boardHeight - this.height);
            this.yPosition = Math.max(this.yPosition, 0);
            this.xPosition = Math.min(this.xPosition, this.boardWidth - this.width);
            this.xPosition = Math.max(this.xPosition, 0);
            this.element.style.left = this.xPosition + "px";
            this.element.style.bottom = this.yPosition + "px";
        }
    }

    loseLife() {
        this.lives -= 1;
    }

    isDead() {
        return this.lives === 0;
    }
}

export default Character;