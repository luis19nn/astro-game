//classes
import { Player } from "./Player";
import { Platform } from "./Platform";
import { GenericObject } from "./GenericObject";

//utils
import { canvas, context, createImage } from "./utils";

//background images
import platform from "../img/platform.png";
import hills from "../img/hills.png";
import background from "../img/background.png";
import platformSmallTall from "../img/platformSmallTall.png";

//canvas configuration
canvas.width = 1024;
canvas.height = 576;

//initialization of some variables
let platformImage = createImage(platform);
let platformSmallTallImage = createImage(platformSmallTall);

let player = new Player();
let platforms = [];
let genericObjects = [];

let collisionPlayerAndPlatform = false;
let lastKey;

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
    player = new Player();

    platformImage = createImage(platform);

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
init();

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
