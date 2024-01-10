
import { FrameTime } from "../interfaces";
import {Camera} from "../camera.ts";
export class FpsCounter {
    private fps : number;
    constructor() {
        this.fps = 0;
    }

    update(time : FrameTime , camera: Camera ) : void     {
        this.fps = Math.round(1 / time.secondsPassed);
    }
    draw(context : CanvasRenderingContext2D) {
        context.font = '14px Arial';
        context.fillStyle = '#00FF00';
        context.textAlign = 'right';
        context.fillText(`${this.fps}`, context.canvas.width-2, context.canvas.height-2);
    }
}