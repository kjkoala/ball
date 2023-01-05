import CoinImg from '../assets/coin.png';
import CoinShadow from '../assets/coin-shadow.png';

export class Coin {
    constructor(game, x, y) {
        this.game = game;
        
        this.image = new Image();
        this.image.src = CoinImg;

        this.coinShadow = new Image();
        this.coinShadow.src = CoinShadow;

        this.frameSize = 16;
        this.coinY = this.game.cubeSize * y + this.frameSize;
        this.x = x;
        this.y = y;

        this.angle = 0;
        this.va = 0.35;

        this.markedForDelete = false;
    }
    update() {
        this.angle += this.va;
        this.coinY += Math.sin(this.angle);
    }

    draw (context) {
        const x =  this.game.cubeSize * this.x + this.frameSize
        const y = this.game.cubeSize * this.y + this.frameSize
        context.drawImage(this.coinShadow, x, y)
        context.drawImage(this.image, x, this.coinY)
    }
}