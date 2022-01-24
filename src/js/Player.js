//utils
import { createImage } from "./utils";
import { canvas, context } from "./utils";

//player images
import spriteRunLeft from "../img/spriteRunLeft.png";
import spriteRunRight from "../img/spriteRunRight.png";
import spriteStandLeft from "../img/spriteStandLeft.png";
import spriteStandRight from "../img/spriteStandRight.png";

const gravity = 1.5;

export class Player {
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
