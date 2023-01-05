import { keysInterract } from "./constants.js";

export class InputHandler {
    constructor() {
       this.keys = new Set();
        window.addEventListener('keydown', (e) => {
            if (keysInterract.includes(e.key) && !this.keys.has(e.key)) {
                this.keys.add(e.key)
            }
        });

        window.addEventListener('keyup', (e) => {
            if (keysInterract.includes(e.key)) {
                this.keys.delete(e.key)
            }
        })
    }
}