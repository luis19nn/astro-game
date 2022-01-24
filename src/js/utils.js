//canvas and context creation
export const canvas = document.querySelector("canvas");
export const context = canvas.getContext("2d");

//function for creation of images
export function createImage(imageSrc) {
    const image = new Image();
    image.src = imageSrc;

    return image;
}
