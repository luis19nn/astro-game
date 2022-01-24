import platform from "../img/platform.png";
import hills from "../img/hills.png";
import background from "../img/background.png";
import platformSmallTall from "../img/platformSmallTall.png";

import spriteRunLeft from "../img/spriteRunLeft.png";
import spriteRunRight from "../img/spriteRunRight.png";
import spriteStandLeft from "../img/spriteStandLeft.png";
import spriteStandRight from "../img/spriteStandRight.png";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

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

        this.speed = 10;

        this.width = 66;
        this.height = 150;

        this.frames = 0;
        this.sprites = {
            stand: {
                right: createImage(spriteStandRight),
                left: createImage(spriteStandLeft),
                cropWidth: 177,
                width: 66,
            },
            run: {
                right: createImage(spriteRunRight),
                left: createImage(spriteRunLeft),
                cropWidth: 341,
                width: 127.875,
            },
        };

        this.currentSprite = this.sprites.stand.right;
        this.currentCropWidth = this.sprites.stand.cropWidth;
    }

    draw() {
        context.drawImage(
            this.currentSprite,
            this.currentCropWidth * this.frames,
            0,
            this.currentCropWidth,
            400,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
    }

    update() {
        this.frames++;

        if (
            this.frames > 59 &&
            (this.currentSprite === this.sprites.stand.right ||
                this.currentSprite === this.sprites.stand.left)
        ) {
            this.frames = 0;
        } else if (
            this.frames > 29 &&
            (this.currentSprite === this.sprites.run.right ||
                this.currentSprite === this.sprites.run.left)
        ) {
            this.frames = 0;
        }

        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.y + this.height + this.velocity.y <= canvas.height)
            this.velocity.y += gravity;
    }
}

class Platform {
    constructor({ x, y, image }) {
        this.position = {
            x,
            y,
        };
        this.image = image;
        this.width = image.width;
        this.height = image.height;
    }

    draw() {
        context.drawImage(this.image, this.position.x, this.position.y);
    }
}

class GenericObject {
    constructor({ x, y, image }) {
        this.position = {
            x,
            y,
        };
        this.image = image;
        this.width = image.width;
        this.height = image.height;
    }

    draw() {
        context.drawImage(this.image, this.position.x, this.position.y);
    }
}

function createImage(imageSrc) {
    const image = new Image();
    image.src = imageSrc;

    return image;
}
let platformImage = createImage(platform);
let platformSmallTallImage = createImage(platformSmallTall);

let player = new Player();

let platforms = [];

let genericObjects = [];

let lastKey;

let collisionPlayerAndPlatform = false;

const keys = {
    right: {
        pressed: false,
    },
    left: {
        pressed: false,
    },
};

let scrollOffset = 0;

function init() {
    platformImage = createImage(platform);

    player = new Player();

    platforms = [
        new Platform({
            x: platformImage.width * 4 + 400 - 2 + platformSmallTallImage.width,
            y: 270,
            image: platformSmallTallImage,
        }),
        new Platform({ x: 0, y: 470, image: platformImage }),
        new Platform({
            x: platformImage.width - 3,
            y: 470,
            image: platformImage,
        }),
        new Platform({
            x: platformImage.width * 2 + 200,
            y: 470,
            image: platformImage,
        }),
        new Platform({
            x: platformImage.width * 3 + 400,
            y: 470,
            image: platformImage,
        }),
        new Platform({
            x: platformImage.width * 4 + 400 - 2,
            y: 470,
            image: platformImage,
        }),
        new Platform({
            x: platformImage.width * 5 + 850 - 2,
            y: 470,
            image: platformImage,
        }),
    ];

    genericObjects = [
        new GenericObject({
            x: -1,
            y: -1,
            image: createImage(background),
        }),
        new GenericObject({
            x: -1,
            y: -1,
            image: createImage(hills),
        }),
    ];

    scrollOffset = 0;
}

function animate() {
    requestAnimationFrame(animate);
    context.fillStyle = "#f2f2f2";
    context.fillRect(0, 0, canvas.width, canvas.height);

    genericObjects.forEach((genericObject) => {
        genericObject.draw();
    });

    platforms.forEach((platform) => {
        platform.draw();
    });
    player.update();

    //player movement
    if (keys.right.pressed && player.position.x < 400) {
        player.velocity.x = player.speed;
    } else if (
        (keys.left.pressed && player.position.x > 100) ||
        (keys.left.pressed && scrollOffset === 0 && player.position.x > 0)
    ) {
        player.velocity.x = -player.speed;
    } else {
        player.velocity.x = 0;

        if (keys.right.pressed) {
            scrollOffset += player.speed;
            platforms.forEach((platform) => {
                platform.position.x -= player.speed;
            });

            genericObjects.forEach((genericObject) => {
                genericObject.position.x -= player.speed * 0.66;
            });
        } else if (keys.left.pressed && scrollOffset > 0) {
            scrollOffset -= player.speed;
            platforms.forEach((platform) => {
                platform.position.x += player.speed;
            });

            genericObjects.forEach((genericObject) => {
                genericObject.position.x += player.speed * 0.66;
            });
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
            collisionPlayerAndPlatform = true;
        }
    });

    //sprite switching
    if (
        keys.right.pressed &&
        lastKey === "right" &&
        player.currentSprite !== player.sprites.run.right
    ) {
        player.frames = 1;

        player.currentSprite = player.sprites.run.right;
        player.currentCropWidth = player.sprites.run.cropWidth;
        player.width = player.sprites.run.width;
    } else if (
        keys.left.pressed &&
        lastKey === "left" &&
        player.currentSprite !== player.sprites.run.left
    ) {
        player.currentSprite = player.sprites.run.left;
        player.currentCropWidth = player.sprites.run.cropWidth;
        player.width = player.sprites.run.width;
    } else if (
        !keys.right.pressed &&
        lastKey === "right" &&
        player.currentSprite !== player.sprites.stand.right
    ) {
        player.currentSprite = player.sprites.stand.right;
        player.currentCropWidth = player.sprites.stand.cropWidth;
        player.width = player.sprites.stand.width;
    } else if (
        !keys.left.pressed &&
        lastKey === "left" &&
        player.currentSprite !== player.sprites.stand.left
    ) {
        player.currentSprite = player.sprites.stand.left;
        player.currentCropWidth = player.sprites.stand.cropWidth;
        player.width = player.sprites.stand.width;
    }

    //win condition
    if (scrollOffset > platformImage.width * 5 + 300 - 2) {
        console.log("YOU WIN!");
    }

    //lose condition
    if (player.position.y + player.height > canvas.height) {
        init();
    }
}
init();
animate();

window.addEventListener("keydown", ({ keyCode }) => {
    switch (keyCode) {
        //a
        case 65:
            keys.left.pressed = true;
            lastKey = "left";
            break;
        //w
        case 87:
            if (collisionPlayerAndPlatform) {
                player.velocity.y -= 25;
                collisionPlayerAndPlatform = false;
            }
            break;
        //d
        case 68:
            keys.right.pressed = true;
            lastKey = "right";
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
    }
});
