import { Position } from '../interfaces';

export default class Fighter {

    private readonly _name: string;
    private position: Position;
    protected image: HTMLImageElement;
    private velocity: number;

    constructor(name: string, x: number, y: number, velocity: number) {
        this._name = name;
        this.position  = { x, y };
        this.image = new Image();
        this.velocity = velocity;
    }

    get name(): string {
        return this._name;
    }
    update(context: CanvasRenderingContext2D) {
        this.position.x += this.velocity;

        if (this.position.x > context.canvas.width - this.image.width || this.position.x < 0) {
            this.velocity = -this.velocity;
        }
    }

    draw(context: CanvasRenderingContext2D) {
        context.drawImage(this.image, this.position.x, this.position.y);
    }



}
