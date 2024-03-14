import Character from './character';

class Rat {
    element: HTMLElement;
    lives: number;
    width: number = 20;
    height: number = 20;
    xPosition: number;
    yPosition: number;
    speed: number = 3;

    constructor(boardElem: HTMLElement) {
        this.lives = 1;
        const randomStart = Math.random();
        if (randomStart < 0.25) {
            this.xPosition = 0 - this.width;
            this.yPosition = Math.floor(Math.random() * boardElem.clientHeight);
        } else if (randomStart < 0.5) {
            this.xPosition = boardElem.clientWidth;
            this.yPosition = Math.floor(Math.random() * boardElem.clientHeight);
        } else if (randomStart < 0.75) {
            this.xPosition = Math.floor(Math.random() * boardElem.clientWidth);
            this.yPosition = 0 - this.height;
        } else {
            this.xPosition = Math.floor(Math.random() * boardElem.clientWidth);
            this.yPosition = boardElem.clientHeight;
        }

        const div = document.createElement('div');
        div.style.width = this.width + "px";
        div.style.height = this.height + "px";
        div.style.left = this.xPosition + "px";
        div.style.bottom = this.yPosition + "px";
        div.classList.add('rat');
        this.element = div;
        boardElem.appendChild(this.element);
    }

    move(character: Character) {
        const characterX = character.characterCenterXPosition();
        const characterY = character.characterCenterYPosition();
        const xDiff = characterX - this.xPosition;
        const yDiff = characterY - this.yPosition;

        if (Math.abs(xDiff) <= character.width / 2 && Math.abs(yDiff) <= character.height / 2){
            character.loseLife();
        } else {
            const angle = Math.atan2(yDiff, xDiff);
            this.yPosition = Math.floor(Math.sin(angle) * this.speed) + this.yPosition;
            this.xPosition = Math.floor(Math.cos(angle) * this.speed) + this.xPosition;
            this.element.style.left = this.xPosition + "px";
            this.element.style.bottom = this.yPosition + "px";
        }
    }

    isHit(x1: number, y1: number, x2: number, y2: number): [number, number] | null {
        const x0 = this.xPosition + this.width / 2;
        const y0 = this.yPosition + this.height / 2;
        const angleOfShot = Math.atan2(y2 - y1, x2 - x1);
        const angleOfRat = Math.atan2(y0 - y1, x0 - x1);
        const angleDiff = angleOfShot - angleOfRat;
        if (Math.abs(angleDiff) < Math.PI / 2) {
            const distanceToRat = Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2));
            const distanceOnLine = Math.cos(angleDiff) * distanceToRat;
            const pointOnLineX = distanceOnLine * Math.cos(angleOfShot) + x1;
            const pointOnLineY = distanceOnLine * Math.sin(angleOfShot) + y1;
            const distanceToShot = Math.sqrt(Math.pow(pointOnLineX - x0, 2) + Math.pow(pointOnLineY - y0, 2));
            if (distanceToShot < this.width / 2) {
                this.lives--;
                return [pointOnLineX, pointOnLineY];
            }
        }
        return null;
    }

    isDead() {
        return this.lives === 0;
    }

    remove() {
        this.element.remove();
    }
}

export default Rat;