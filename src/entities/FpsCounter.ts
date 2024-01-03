
import { FrameTime } from "../interfaces";
export class FpsCounter {
    private fps : number;
    constructor() {
        this.fps = 0;
    }

    update(time : FrameTime  ) : void     {
        this.fps = Math.round(1 / time.secondsPassed);
    }
    draw(context : CanvasRenderingContext2D) {
        context.fillStyle = 'back';
        context.font = 'bold 20px Arial';
        context.textAlign = 'center';
        context.fillText(`FPS : ${this.fps}`, context.canvas.width/2, 30);
    }
}