import {Position, FrameTime, Animations, Velocity} from '../../interfaces';
import {fighterState} from "../../constants/fighter.ts";
import InitialVelocity from "../../interfaces/InitialVelocity.ts";
import {STAGE_FLOOR} from "../../constants/stage.ts";
export default class Fighter {

    private readonly _name: string;
    protected image: HTMLImageElement;
    protected frames: Map<string, number[][]>;
    private position: Position;
    private velocity : Velocity;
    protected initialVelocity : InitialVelocity;
    private animationFrame : number;
    private animationTimer : number;
    private currentState : string;
    protected animations: Animations;
    protected direction;
    protected gravity: number;
    protected states;





    constructor(name: string, x: number, y: number, direction : number) {
        this._name = name;
        this.position  = { x, y };
        this.image = new Image();
        this.velocity = {x:0 ,y:0};
        this.initialVelocity = { jump:0};
        this.frames= new Map();
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.currentState = "";
        this.animations = {};
        this.direction = direction;
        this.gravity = 0;
        this.states = {
            [fighterState.JUMP_UP]: {
                init: this.handleJumpUpInit.bind(this),
                update: this.handleJumpUpState.bind(this)

            },
            [fighterState.IDLE]: {
                init: this.handleIdleInit.bind(this),
                update: this.handleIdleState.bind(this)

            },
            [fighterState.WALK_FORWARD]: {
                init: this.handleWalkForwardInit.bind(this),
                update: this.handleWalkForwardState.bind(this)

            },
            [fighterState.WALK_BACKWARD]: {
                init: this.handleWalkBackwardInit.bind(this),
                update: this.handleWalkBackwardState.bind(this)
            },
        }

        this.changeState(fighterState.IDLE);
    }

    handleJumpUpInit = () => {
        this.velocity.y = this.initialVelocity.jump;
    }
    handleJumpUpState = (time:FrameTime ) => {
        this.velocity.y += this.gravity * time.secondsPassed;
        if(this.position.y > STAGE_FLOOR) {
            this.position.y = STAGE_FLOOR;
            this.changeState(fighterState.IDLE);
        }
    }
    handleIdleInit = () => {
        this.velocity.x = 0;
        this.velocity.y = 0;
    }
    handleIdleState = () => {

    }

    handleWalkForwardInit = () => {
        this.velocity.x = 150 * this.direction;
    }
    handleWalkForwardState = () => {

    }
    handleWalkBackwardInit = () => {
        this.velocity.x = -150 * this.direction;

    }
    handleWalkBackwardState = () => {

    }

    get name(): string {
        return this._name;
    }

    changeState(newState : string) {
        this.currentState = newState;
        this.animationFrame = 0;
        this.states[this.currentState].init();
    }


    updateStageContraints(context : CanvasRenderingContext2D) {
        const WIDTH = 32;
        if (this.position.x > context.canvas.width - WIDTH ) {
            this.position.x = context.canvas.width - WIDTH;
        }

        if (this.position.x < WIDTH ) {
            this.position.x = WIDTH;
        }
    }

    updateAnimation(time : FrameTime) {
        if( time.previous > this.animationTimer+60) {
            this.animationTimer = time.previous;
            this.animationFrame++;
            if(this.animationFrame > this.animations[this.currentState].length-1) this.animationFrame = 0;
        }
    }
    update(time : FrameTime, context: CanvasRenderingContext2D) {
        this.position.x += this.velocity.x * time.secondsPassed;
        this.position.y += this.velocity.y * time.secondsPassed;
        this.states[this.currentState].update(time);
        this.updateAnimation(time);
        this.updateStageContraints(context);
    }

    draw(context: CanvasRenderingContext2D) {
        const [
            [x, y, width, height],
            [originX, originY]
        ] = <number[][]>this.frames.get(this.animations[this.currentState][this.animationFrame]);

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
