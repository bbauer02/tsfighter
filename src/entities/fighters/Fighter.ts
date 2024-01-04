import {FighterAnimations, FrameTime, Position, Velocity} from '../../interfaces';
import {FighterState} from "../../constants/fighter.ts";
import InitialVelocity from "../../interfaces/InitialVelocity.ts";
import {STAGE_FLOOR} from "../../constants/stage.ts";
import {isKeyDown, isKeyUp} from "../../InputHandle.ts";

export default class Fighter {

    private readonly _name: string;
    protected image: HTMLImageElement;
    protected frames: Map<string, number[][]>;
    private position: Position;
    private velocity : Velocity;
    protected initialVelocity : InitialVelocity | undefined;
    private animationFrame : number;
    private animationTimer : number;
    private currentState : FighterState;
    protected animations: FighterAnimations | undefined;
    protected direction;
    protected gravity: number;
    protected states;





    constructor(name: string, x: number, y: number, direction : number) {
        this._name = name;
        this.position  = { x, y };
        this.image = new Image();
        this.velocity = {x:0 ,y:0};
        this.initialVelocity = undefined;
        this.frames= new Map();
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.currentState = FighterState.IDLE;
        this.animations = undefined;
        this.direction = direction;
        this.gravity = 0;
        this.states = {
            [FighterState.JUMP_UP]: {
                init: this.handleJumpInit.bind(this),
                update: this.handleJumpState.bind(this),
                validFrom: [FighterState.IDLE]

            },
            [FighterState.IDLE]: {
                init: this.handleIdleInit.bind(this),
                update: this.handleIdleState.bind(this),
                validFrom: [
                    FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD, FighterState.JUMP_UP,
                    FighterState.JUMP_FORWARD, FighterState.JUMP_BACKWARD,
                    FighterState.CROUCH_UP
                ]

            },
            [FighterState.WALK_FORWARD]: {
                init: this.handleMoveInit.bind(this),
                update: this.handleWalkForwardState.bind(this),
                validFrom: [FighterState.IDLE, FighterState.JUMP_BACKWARD, FighterState.WALK_BACKWARD]

            },
            [FighterState.WALK_BACKWARD]: {
                init: this.handleMoveInit.bind(this),
                update: this.handleWalkBackwardState.bind(this),
                validFrom: [FighterState.IDLE, FighterState.JUMP_FORWARD, FighterState.WALK_FORWARD]
            },
            [FighterState.JUMP_FORWARD]: {
                init: this.handleJumpInit.bind(this),
                update: this.handleJumpState.bind(this),
                validFrom: [FighterState.IDLE, FighterState.WALK_FORWARD]
            },
            [FighterState.JUMP_BACKWARD]: {
                init: this.handleJumpInit.bind(this),
                update: this.handleJumpState.bind(this),
                validFrom: [FighterState.IDLE,FighterState.WALK_BACKWARD]
            },
            [FighterState.CROUCH] : {
                init: () => {},
                update: () => {},
                validFrom : [FighterState.CROUCH_DOWN],
            },
            [FighterState.CROUCH_DOWN] : {
                init: () => {},
                update: this.handleCrouchDownState.bind(this),
                validFrom : [FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD],
            },
            [FighterState.CROUCH_UP] : {
                init: () => {},
                update: this.handleCrouchUpState.bind(this),
                validFrom : [FighterState.CROUCH],
            },
        }

        this.changeState(FighterState.IDLE);
    }

    handleCrouchDownState = () => {
        if(this.animations && this.animations[this.currentState][this.animationFrame][1] === -2) {
            this.changeState(FighterState.CROUCH);
        }
    }

    handleCrouchUpState = () => {
        if(this.animations && this.animations[this.currentState][this.animationFrame][1] === -2) {
            this.changeState(FighterState.IDLE);
        }
    }

    handleJumpInit = () => {
        if(this.initialVelocity) {
            this.velocity.y = this.initialVelocity.jump;
           this.handleMoveInit();
        }
    }
    handleJumpState = (time:FrameTime ) => {
        this.velocity.y += this.gravity * time.secondsPassed;
        if(this.position.y > STAGE_FLOOR) {
            this.position.y = STAGE_FLOOR;
            this.changeState(FighterState.IDLE);
        }
    }
    handleIdleInit = () => {
        this.velocity.x = 0;
        this.velocity.y = 0;
    }
    handleIdleState = () => {
        if(isKeyDown('ArrowLeft')) this.changeState(FighterState.WALK_BACKWARD);
        if(isKeyDown('ArrowRight')) this.changeState(FighterState.WALK_FORWARD);
    }

    handleWalkForwardState = () => {
        if(isKeyUp('ArrowRight')) this.changeState(FighterState.IDLE);
    }

    handleWalkBackwardState = () => {
        if(isKeyUp('ArrowLeft')) this.changeState(FighterState.IDLE);
    }

    handleMoveInit = () => {
        // @ts-ignore
        this.velocity.x = this.initialVelocity?.x[this.currentState] ?? 0;
    }
    handleMoveState = () => {

    }


    get name(): string {
        return this._name;
    }

    changeState(newState : string) {
        if( newState  as FighterState === this.currentState
            || !this.states[newState  as FighterState].validFrom.includes(this.currentState)) return;

        this.currentState = newState as FighterState;
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
        if(this.animations) {

            const animation  = this.animations[this.currentState];

            const [, frameDelay] = animation[this.animationFrame];
            if( time.previous > this.animationTimer+frameDelay) {
                this.animationTimer = time.previous;
                if(frameDelay > 0) {
                    this.animationFrame++;
                }

                if(this.animationFrame > animation.length-1)  {
                    this.animationFrame = 0
                }
            }
        }
    }
    update(time : FrameTime, context: CanvasRenderingContext2D) {
        this.position.x += (this.velocity.x * this.direction) * time.secondsPassed;
        this.position.y += this.velocity.y * time.secondsPassed;
        this.states[this.currentState].update(time);
        this.updateAnimation(time);
        this.updateStageContraints(context);
    }

    draw(context: CanvasRenderingContext2D) {
        if(this.animations) {
            const [frameKey] = this.animations[this.currentState][this.animationFrame];

            const [
                [x, y, width, height],
                [originX, originY]
            ] = <number[][]>this.frames.get(frameKey);

            context.scale(this.direction, 1);
            context.drawImage(
                this.image,x,y,
                width, height,
                Math.floor(this.position.x * this.direction) - originX, Math.floor(this.position.y) - originY, width, height);
            context.setTransform(1,0,0,1,0,0);

            this.drawDebug(context);
        }
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
