export class FpsCounter {
    private fps : number;
    constructor() {
        this.fps = 0;
    }

    update(secondsPassed : number  ) : void     {
        this.fps = Math.round(1 / secondsPassed);
    }
    draw(context : CanvasRenderingContext2D) {
        context.fillStyle = 'back';
        context.font = 'bold 20px Arial';
        context.textAlign = 'center';
        context.fillText(`FPS : ${this.fps}`, context.canvas.width/2, 30);
    }
}