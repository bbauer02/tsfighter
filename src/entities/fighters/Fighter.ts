import {Position, FrameTime, Animations} from '../../interfaces';

export default class Fighter {

    private readonly _name: string;
    protected image: HTMLImageElement;
    protected frames: Map<string, number[][]>;
    private position: Position;
    private velocity: number;
    private animationFrame : number;
    private animationTimer : number;
    private state : string;
    protected animations: Animations;
    protected direction;


    constructor(name: string, x: number, y: number, direction : number) {
        this._name = name;
        this.position  = { x, y };
        this.image = new Image();
        this.velocity = 150 * direction
        this.frames= new Map();
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.state = this.changeState();
        this.animations = {};
        this.direction = direction;


    }

    get name(): string {
        return this._name;
    }

    changeState = () => this.velocity * this.direction < 0 ? 'walkBackwards' : 'walkForwards';

    update(time : FrameTime, context: CanvasRenderingContext2D) {
        const [
            [, , width]
        ] = <number[][]>this.frames.get(this.animations[this.state][this.animationFrame]);

        if( time.previous > this.animationTimer+60) {
            this.animationTimer = time.previous;
            this.animationFrame++;
            if(this.animationFrame > 5) this.animationFrame = 0;
        }


        this.position.x += this.velocity * time.secondsPassed;


        if (this.position.x > context.canvas.width - width / 2 ) {
            this.velocity = -150;
            this.state = this.changeState();
        }

        if (this.position.x < width / 2 ) {
            this.velocity = 150;
            this.state = this.changeState();
        }
    }

    draw(context: CanvasRenderingContext2D) {
        const [
            [x, y, width, height],
            [originX, originY]
        ] = <number[][]>this.frames.get(this.animations[this.state][this.animationFrame]);

        context.scale(this.direction, 1);
        context.drawImage(
            this.image,x,y,
            width, height,
            Math.floor(this.position.x * this.direction) - originX, Math.floor(this.position.y) - originY, width, height);
        context.setTransform(1,0,0,1,0,0);

        this.drawDebug(context);
    }

    drawDebug(context: CanvasRenderingContext2D) {
        context.lineWidth = 1;
        context.beginPath();
        context.strokeStyle = 'white';
        context.moveTo(Math.floor(this.position.x-4.5), Math.floor(this.position.y));
        context.lineTo(Math.floor(this.position.x+4.5), Math.floor(this.position.y));
        context.moveTo(Math.floor(this.position.x), Math.floor(this.position.y-4.5));
        context.lineTo(Math.floor(this.position.x), Math.floor(this.position.y+4.5));
        context.stroke();
    }



}
