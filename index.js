const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gravity = 1.5;

class Player {
    constructor() {
        this.position = {
            x: 100,
            y: 100,
        };
        this.velocity = {
            x: 0,
            y: 0,
        };
        this.width = 30;
        this.height = 30;
    }

    draw() {
        context.fillStyle = "red";
        context.fillRect(
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.y + this.height + this.velocity.y <= canvas.height)
            this.velocity.y += gravity;
        else this.velocity.y = 0;
    }
}

class Platform {
    constructor({ x, y }) {
        this.position = {
            x,
            y,
        };
        this.width = 200;
        this.height = 20;
    }

    draw() {
        context.fillStyle = "blue";
        context.fillRect(
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
    }
}

const player = new Player();
const platforms = [
    new Platform({ x: 400, y: 400 }),
    new Platform({ x: 800, y: 420 }),
];

const keys = {
    right: {
        pressed: false,
    },
    left: {
        pressed: false,
    },
};

let scrollOffset = 0;

function animate() {
    requestAnimationFrame(animate);
    context.clearRect(0, 0, canvas.width, canvas.height);

    player.update();
    platforms.forEach((platform) => {
        platform.draw();
    });

    //player movement
    if (keys.right.pressed && player.position.x < 400) {
        player.velocity.x = 5;
    } else if (keys.left.pressed && player.position.x > 100) {
        player.velocity.x = -5;
    } else {
        player.velocity.x = 0;

        if (keys.right.pressed) {
            scrollOffset += 5;
            platforms.forEach((platform) => {
                platform.position.x -= 5;
            });
        } else if (keys.left.pressed) {
            scrollOffset -= 5;
            platforms.forEach((platform) => {
                platform.position.x += 5;
            });
        }

        if (scrollOffset > 2000) {
            console.log("YOU WIN!");
        }
    }

    //collision between player and platform
    platforms.forEach((platform) => {
        if (
            player.position.y + player.height <= platform.position.y &&
            player.position.y + player.height + player.velocity.y >=
                platform.position.y &&
            player.position.x + player.width >= platform.position.x &&
            player.position.x <= platform.position.x + platform.width
        ) {
            player.velocity.y = 0;
        }
    });
}
animate();

window.addEventListener("keydown", ({ keyCode }) => {
    switch (keyCode) {
        //a
        case 65:
            keys.left.pressed = true;
            break;
        //w
        case 87:
            player.velocity.y -= 20;
            break;
        //d
        case 68:
            keys.right.pressed = true;
            break;
        //s
        case 83:
            break;
    }
});

window.addEventListener("keyup", ({ keyCode }) => {
    switch (keyCode) {
        //a
        case 65:
            keys.left.pressed = false;
            break;
        //w
        case 87:
            player.velocity.y = 0;
            break;
        //d
        case 68:
            keys.right.pressed = false;
            break;
        //s
        case 83:
            break;
    }
});
