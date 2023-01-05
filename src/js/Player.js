import Characters from '../assets/characters.png';
import PlayerShadow from '../assets/shadow.png';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from './constants';
import { mapData } from './mapData';

export class Player {
    constructor(game, name) {
        this.game = game;

        this.image = new Image();
        this.image.src = Characters;

        this.shadowImage = new Image();
        this.shadowImage.src = PlayerShadow;

        this.frameSize = 16;
        this.frameX = 0;
        this.frameY = 0;
        this.x = mapData.minX + 2;
        this.y = mapData.minY;
        this.pixelX = this.game.cubeSize * this.x + this.frameSize;
        this.pixelY = this.game.cubeSize * this.y + this.frameSize;
        this.movingPixelsX = this.game.cubeSize * this.x + this.frameSize;
        this.movingPixelsY = this.game.cubeSize * this.y + this.frameSize;
        this.playerCoins = 0;

        this.playerDisplay = this.userNameDisplay()
        this.playerName = name
    }

    update(input) {
        this.move(input)
        this.checkCoinsCollision();
        if (this.pixelX < this.movingPixelsX) {
            this.pixelX += this.game.speed;
        } else if (this.pixelX > this.movingPixelsX) {
            this.pixelX -= this.game.speed;
        }

        if (this.pixelY < this.movingPixelsY) {
            this.pixelY += this.game.speed;
        } else if (this.pixelY > this.movingPixelsY) {
            this.pixelY -= this.game.speed;
        }
    }

    move(input) {
        if (input.keys.has(ArrowRight) && this.pixelX === this.movingPixelsX) {
            this.checkCollision('x', this.x + 1)
            this.frameX = this.frameSize;
        }
        if (input.keys.has(ArrowLeft) && this.pixelX === this.movingPixelsX) {
            this.checkCollision('x', this.x - 1)
            this.frameX = 0;
        }
        if (input.keys.has(ArrowDown) && this.pixelY === this.movingPixelsY) {
            this.checkCollision('y', this.y + 1)
        }
        if (input.keys.has(ArrowUp) && this.pixelY === this.movingPixelsY) {
            this.checkCollision('y', this.y - 1)
        }
    };

    checkCollision(axis, coord) {
        if(mapData.blockedSpaces.includes(axis === 'x' ? `${coord}x${this.y}` : `${this.x}x${coord}`)) {
            return false;
        }
        if (axis === 'x' && coord <= mapData.maxX && coord >= mapData.minX) {
            this.movingPixelsX = this.game.cubeSize * coord + this.frameSize;
            this.x = coord;
        }
         if (axis === 'y' && coord <= mapData.maxY && coord >= mapData.minY) {
            this.movingPixelsY = this.game.cubeSize * coord + this.frameSize;
            this.y = coord;
        }
    }

    checkCoinsCollision() {
        this.game.coins.forEach((coin) => {
            if (coin.x === this.x && coin.y === this.y) {
                coin.markedForDelete = true;
                this.playerCoins += 1;
            }
        })
    }
    userNameDisplay() {
        const div = document.createElement('div')
        div.className = 'player_display';
        document.body.append(div)
        return div;
    }
    draw(context) {
        this.playerDisplay.innerHTML = `<div><span>${this.playerName}: </span><span class="player_coin">${this.playerCoins}</span></div>`
        this.playerDisplay.style.transform = `translate(${this.pixelX}px, ${this.pixelY}px)`
        context.drawImage(this.shadowImage, this.pixelX, this.pixelY + 2);
        context.drawImage(this.image, this.frameX, this.frameY, this.frameSize, this.frameSize, this.pixelX, this.pixelY, this.frameSize, this.frameSize);
    }
}