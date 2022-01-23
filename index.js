const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Player {
    constructor() {
        this.position = {
            X: 100,
            Y: 100,
        };
        this.width = 30;
        this.height = 30;
    }

    draw() {
        context.fillStyle = "red";
        context.fillRect(
            this.position.X,
            this.position.Y,
            this.width,
            this.height
        );
    }
}

const player = new Player();
player.draw();
