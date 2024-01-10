import {Camera} from "../camera.ts";
import {drawFrame} from "../utils/context.ts";

export class Stage {
    private image: HTMLImageElement;
    private frames : Map<string, number[]>;
    constructor() {
        this.image = <HTMLImageElement>document.querySelector('img[alt="stage"]');
        this.frames = new Map([
            ["background-boat", [72, 208, 768, 176]],
            ["stage-boat", [8, 16, 521, 180]],
            ["stage-floor", [8, 392, 896, 72]],

            // Grey Suit Man
            ["grey-suit-1", [600, 24, 16, 24]],
            ["grey-suit-2", [600, 88, 16, 24]],

            // Bollards
            ["bollard-small", [800, 184, 21, 16]],
            ["bollard-large", [760, 176, 31, 24]],

            ["barrels", [560, 472, 151, 96]],
        ]);
    }


    drawFrame(context:CanvasRenderingContext2D, frameKey : string, x : number, y :number ) {
        drawFrame(context, this.image, this.frames.get(frameKey), x, y);
    }

    draw(context: CanvasRenderingContext2D, camera: Camera) {
        this.drawFrame(context, "background-boat", Math.floor(16-(camera.position.x / 2.157303)), - camera.position.y);
        this.drawFrame(context, "stage-boat", Math.floor(150-(camera.position.x / 1.613445)), -1 -  camera.position.y);
        this.drawFrame(context, "stage-floor", Math.floor(192 - camera.position.x), 176 - camera.position.y);
    }

    update() {
        // nothing to do
    }

}

