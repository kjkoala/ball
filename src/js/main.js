import '../css/main.css'
import { Coin } from './Coin';
import { InputHandler } from './input';
import { Player } from './Player';
import { randomCoords } from './helpers';
import { socket } from './server/socket';
import { mapData } from './mapData';

const username = prompt('Enter Username')

// if (username) {
    socket.auth = { username, x: mapData.minX, y: mapData.minY }
    socket.connect()

    // socket.on("users", (users) => {
    //     console.log('users', users)
    // })
    
    // socket.on("user connected", (user) => {
    //     console.log('user', user)
    // })
    
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
        this.speed = 2;

        canvas.width = width;
        canvas.height = height;

        this.fps = 59;
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;

        this.cubeSize = 16;

        this.keys = new InputHandler();
        // this.player = new Player(this, 'Джордж');
        this.players = new Set();
        this.coins = new Set();
        this.coinSpawnTime = 500;
        this.coinSpawinInterval = 0;
    }

    addPlayer(name) {
        this.players.add(new Player(this, name))
    }
    addPlayers (users) {
        users.forEach(user => {
            this.players.add(new Player(this, user.username))
        })
    }

    update(deltaTime) {
        this.players.forEach(player => player.update(this.keys))
        // this.player.update(this.keys)
        this.coins.forEach(coin => {
            if (coin.markedForDelete) {
                this.coins.delete(coin)
            }
            coin.update(deltaTime)
        })
        if (this.coinSpawinInterval > this.coinSpawnTime) {
            this.coinSpawinInterval = 0
            const { x, y } = randomCoords()
            this.coins.add(new Coin(this, x, y))
        } else {
            this.coinSpawinInterval += deltaTime
        }
    }
    
    draw(context) {
        this.coins.forEach(coin => coin.draw(context))
        this.players.forEach(player => player.draw(context))
        // this.player.draw(context)
    }
}

const game = new Game(240, 208);
let lastTime = 0;

socket.on("user connected", (user) => {
    game.addPlayer(user.username)
})

socket.on("users", (users) => {
    game.addPlayers(users);
})

;(function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    if (game.frameTimer > game.frameInterval) {
        game.frameTimer = 0
        ctx.clearRect(0, 0, game.width, game.height)
        game.update(deltaTime)
        game.draw(ctx)
    } else {
        game.frameTimer += deltaTime;
    }

    requestAnimationFrame(animate);
}(lastTime));
