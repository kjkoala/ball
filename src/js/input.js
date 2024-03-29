import { keysInterract } from "./constants.js";

export class InputHandler {
    constructor(game) {
        this.game = game;
        this.keys = new Set();
            window.addEventListener('keydown', (e) => {
                if (keysInterract.includes(e.key) && !this.keys.has(e.key)) {
                    this.keys.add(e.key)
                    this.game.socket.emit('keypress', {
                        key: e.key,
                        x: this.game.player.x,
                        y: this.game.player.y,
                    })
                }
            });

        window.addEventListener('keyup', (e) => {
            if (keysInterract.includes(e.key)) {
                this.keys.delete(e.key)
                this.game.socket.emit('keyup', {
                    key: e.key,
                    x: this.game.player.x,
                    y: this.game.player.y,
                })
            }
        })
    }
}