import '../css/main.css'
import { InputHandler } from './input';
// import { mapData } from './mapData';
import { Player } from './Player';
// import { socket } from './server/socket';

// const username = prompt('Enter Username')

// if (username) {
//     socket.auth = { username, x: mapData.minX, y: mapData.minY }
//     socket.connect()

//     socket.on("users", (users) => {
//         console.log('users', users)
//     })
    
//     socket.on("user connected", (user) => {
//         console.log('user', user)
//     })
    
//     socket.on("user disconnected", (userID) => {
//         console.log('userID', userID)
//     })

//     socket.emit()
// }


const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

document.body.append(canvas);

class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.speed = 3;

        canvas.width = width;
        canvas.height = height;

        this.fps = 60;
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;

        this.cubeSize = 48;

        this.keys = new InputHandler();
        this.player = new Player(this, 'СУПЕР ЖОРИК 2000!');
    }

    update() {
        this.player.update(this.keys)
    }

    draw(context) {
        this.player.draw(context)
    }
}

const game = new Game(720, 624);
let lastTime = 0;

;(function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    if (game.frameTimer > game.frameInterval) {
        game.frameTimer = 0
        ctx.clearRect(0, 0, game.width, game.height)
        game.update()
        game.draw(ctx)
    } else {
        game.frameTimer += deltaTime;
    }

    requestAnimationFrame(animate);
}(lastTime));
