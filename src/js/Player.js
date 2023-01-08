import Characters from '../assets/characters.png';
import PlayerShadow from '../assets/shadow.png';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from './constants.js';
import { mapData } from './mapData.js';

export class Player {
    constructor(game, name, x, y, userID, skin) {
        this.game = game;
        this.userID = userID;

        this.image = new Image();
        this.image.src = Characters;

        this.shadowImage = new Image();
        this.shadowImage.src = PlayerShadow;

        this.frameSize = 16;
        this.frameX = 16;
        this.frameY = 16 * skin;
        this.x = x;
        this.y = y;
        this.pixelX = this.game.cubeSize * this.x + this.frameSize;
        this.pixelY = this.game.cubeSize * this.y + this.frameSize;
        this.movingPixelsX = this.game.cubeSize * this.x + this.frameSize;
        this.movingPixelsY = this.game.cubeSize * this.y + this.frameSize;
        this.playerCoins = 0;

        this.playerDisplay = this.userNameDisplay()
        this.playerName = name;

        this.serverPlayerKey = {
            keys: new Set()
        }
    }

    update(input) {
        input && this.move(input)
        this.moveOtherPlayer();
        // this.checkCoinsCollision();
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

    moveOtherPlayer(keyStatus, user) {
        if (keyStatus === 'keypress') {
            this.x = user.x;
            this.y = user.y;
            this.serverPlayerKey.keys.add(user.key)
        } else if (keyStatus === 'keyup') {
            this.x = user.x;
            this.y = user.y;
            this.serverPlayerKey.keys.delete(user.key)
        }
        this.move(this.serverPlayerKey)
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
    delete() {
        this.playerDisplay.remove()
    }
    draw(context) {
        this.playerDisplay.innerHTML = `<div><span>${this.playerName}: </span><span class="player_coin">${this.playerCoins}</span></div>`
        this.playerDisplay.style.transform = `translate(${this.pixelX}px, ${this.pixelY}px)`
        context.drawImage(this.shadowImage, this.pixelX, this.pixelY + 2);
        context.drawImage(this.image, this.frameX, this.frameY, this.frameSize, this.frameSize, this.pixelX, this.pixelY, this.frameSize, this.frameSize);
    }
}