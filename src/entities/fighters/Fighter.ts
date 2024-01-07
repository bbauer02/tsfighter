import {FighterAnimations, FrameTime, Position, Velocity} from '../../interfaces';
import {fighterDirection, FighterState} from "../../constants/fighter.ts";
import InitialVelocity from "../../interfaces/InitialVelocity.ts";
import {STAGE_FLOOR} from "../../constants/stage.ts";
import * as control from "../../InputHandle.ts";
import {rectsOverlap} from "../../utils/collisions.ts";
import frameTime from "../../interfaces/FrameTime.ts";


export default class Fighter {

    private playerId : number;
    private readonly _name: string;
    protected image: HTMLImageElement;
    protected frames: Map<string, number[][]>;
    position: Position;
    private velocity : Velocity;
    protected initialVelocity : InitialVelocity | undefined;
    private animationFrame : number;
    private animationTimer : number;
    private currentState : FighterState;
    protected animations: FighterAnimations | undefined;
    protected direction;
    protected gravity: number;
    protected states;
    opponent : Fighter | undefined = undefined;

    pushBox = {x: 0, y:0, width:0, height:0};

    // @ts-ignore
    constructor(name: string, x: number, y: number, direction : number, playerId : number) {
        this.playerId = playerId;
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
        this.states  = {
            [FighterState.JUMP_START]: {
                init: this.handleJumpStartInit.bind(this),
                update: this.handleJumpStartState.bind(this),
                validFrom: [
                    FighterState.IDLE, FighterState.JUMP_LAND,
                    FighterState.WALK_BACKWARD, FighterState.WALK_FORWARD
                ]
            },
            [FighterState.JUMP_UP]: {
                init: this.handleJumpInit.bind(this),
                update: this.handleJumpState.bind(this),
                validFrom: [
                    FighterState.JUMP_START
                ]

            },
            [FighterState.JUMP_FORWARD]: {
                init: this.handleJumpInit.bind(this),
                update: this.handleJumpState.bind(this),
                validFrom: [FighterState.JUMP_START,]
            },
            [FighterState.JUMP_BACKWARD]: {
                init: this.handleJumpInit.bind(this),
                update: this.handleJumpState.bind(this),
                validFrom: [FighterState.JUMP_START,]
            },
            [FighterState.JUMP_LAND]: {
                init: this.handleJumpLandInit.bind(this),
                update: this.handleJumpLandState.bind(this),
                validFrom: [
                    FighterState.JUMP_UP, FighterState.JUMP_FORWARD, FighterState.JUMP_BACKWARD
                ]
            },

            [FighterState.IDLE]: {
                init: this.handleIdleInit.bind(this),
                update: this.handleIdleState.bind(this),
                validFrom: [
                    undefined,
                    FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD, FighterState.JUMP_UP,
                    FighterState.JUMP_FORWARD, FighterState.JUMP_BACKWARD,
                    FighterState.CROUCH_UP, FighterState.JUMP_LAND, FighterState.IDLE_TURN
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
            [FighterState.CROUCH] : {
                init: () => {},
                update: this.handleCrounchState.bind(this),
                validFrom : [FighterState.CROUCH_DOWN, FighterState.CROUCH_TURN],
            },
            [FighterState.CROUCH_DOWN] : {
                init: this.handleCrounchDownInit.bind(this),
                update: this.handleCrouchDownState.bind(this),
                validFrom : [FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD],
            },
            [FighterState.CROUCH_UP] : {
                init: () => {},
                update: this.handleCrouchUpState.bind(this),
                validFrom : [FighterState.CROUCH],
            },
            [FighterState.IDLE_TURN] : {
                init: () => {},
                update: this.handleIdleTurnState.bind(this),
                validFrom : [FighterState.IDLE, FighterState.JUMP_LAND, FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD],
            },
            [FighterState.CROUCH_TURN] : {
                init: () => {},
                update: this.handleCrouchTurnState.bind(this),
                validFrom : [FighterState.CROUCH],
            },
        }

        this.changeState(FighterState.IDLE);
    }

    handleCrounchDownInit = () => {
        this.handleIdleInit();
    }
    handleCrounchInit = () => {

    }
    handleCrounchState = () => {
        if(!control.isDown(this.playerId)) this.changeState(FighterState.CROUCH_UP);

        const newDirection = this.getDirection();
        if(newDirection !== this.direction) {
            this.direction = newDirection;
            this.changeState(FighterState.CROUCH_TURN);
        }

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
            this.changeState(FighterState.JUMP_LAND);
        }
    }
    handleIdleInit = () => {
        this.velocity.x = 0;
        this.velocity.y = 0;
    }
    handleIdleState = () => {
        if(control.isUp(this.playerId)) this.changeState(FighterState.JUMP_START);
        if(control.isDown(this.playerId)) this.changeState(FighterState.CROUCH_DOWN);

        if(control.isBackward(this.playerId, this.direction)) this.changeState(FighterState.WALK_BACKWARD);
        if(control.isForward(this.playerId, this.direction)) this.changeState(FighterState.WALK_FORWARD);

        const newDirection = this.getDirection();
        if(newDirection !== this.direction) {
            this.direction = newDirection;
            this.changeState(FighterState.IDLE_TURN);
        }
    }

    handleWalkForwardState = () => {
        if(!control.isForward(this.playerId, this.direction)) this.changeState(FighterState.IDLE);
        if(control.isUp(this.playerId)) this.changeState(FighterState.JUMP_START);
        if(control.isDown(this.playerId)) this.changeState(FighterState.CROUCH_DOWN);

        this.direction = this.getDirection();

    }

    handleWalkBackwardState = () => {
        if(!control.isBackward(this.playerId, this.direction)) this.changeState(FighterState.IDLE);
        if(control.isUp(this.playerId)) this.changeState(FighterState.JUMP_START);
        if(control.isDown(this.playerId)) this.changeState(FighterState.CROUCH_DOWN);

        this.direction = this.getDirection();

    }

    handleIdleTurnState() {
        this.handleIdleState();
       if(this.animations && this.animations[this.currentState][this.animationFrame][1] !== -2) return;
        this.changeState(FighterState.IDLE);
    }

    handleCrouchTurnState() {
        this.handleCrounchState();

        if(this.animations && this.animations[this.currentState][this.animationFrame][1] !== -2) return;
        this.changeState(FighterState.CROUCH);
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

    hasCollidedWithOpponent = () =>
        this.opponent && rectsOverlap(
            this.position.x + this.pushBox.x,
            this.position.y + this.pushBox.y,
            this.pushBox.width,
            this.pushBox.height,
            this.opponent.position.x + this.pushBox.x,
            this.opponent.position.y! + this.pushBox.y,
            this.opponent.pushBox.width,
            this.opponent.pushBox.height
        );

    getDirection = () => {
        if(  this.opponent&&this.position.x + this.pushBox.width
            <= this.opponent.position.x + this.opponent.pushBox.x) {
            return fighterDirection.RIGHT;
        } else if ( this.opponent&&this.position.x + this.pushBox.x
            >= this.opponent.position.x + this.opponent?.pushBox.x + this.opponent?.pushBox.width ) {
            return fighterDirection.LEFT;
        }
            return this.direction;
    }

    getPushBox(frameKey: string) {
        const framesData = this.frames.get(frameKey);

        if(framesData) {
            const [,, [x,y,width, height] = [0,0,0,0]] = framesData;
            return {x, y, width, height}
        }
        else {
            return {x:0, y:0, width:0, height: 0};
        }
    }
    changeState(newState : string) {
        if( newState  as FighterState === this.currentState
            || !this.states[newState  as FighterState].validFrom.includes(this.currentState)) return;

        this.currentState = newState as FighterState;
        this.animationFrame = 0;
        this.states[this.currentState as FighterState].init();
    }


    updateStageContraints(time : frameTime, context : CanvasRenderingContext2D) {

        if (this.position.x > context.canvas.width - this.pushBox.width ) {
            this.position.x = context.canvas.width - this.pushBox.width;
        }

        if (this.position.x < this.pushBox.width ) {
            this.position.x = this.pushBox.width;
        }

        if(this.opponent&&this.hasCollidedWithOpponent()) {
            if(this.position.x <= this.opponent.position.x) {
                this.position.x = Math.max(
                    (this.opponent.position.x + this.opponent.pushBox.x) - (this.pushBox.x + this.pushBox.width),
                    this.pushBox.width
                );

                if([
                    FighterState.IDLE, FighterState.CROUCH, FighterState.JUMP_UP,
                    FighterState.JUMP_FORWARD, FighterState.JUMP_BACKWARD].includes(this.opponent.currentState)) {
                    this.opponent.position.x += 66 * time.secondsPassed;
                }
            }

            if(this.position.x >= this.opponent.position.x) {
                this.position.x = Math.min(
                    (this.opponent.position.x + this.opponent.pushBox.x + this.opponent.pushBox.width)
                    + (this.pushBox.width + this.pushBox.x ),
                    context.canvas.width - this.pushBox.width,
                );

                if([
                    FighterState.IDLE, FighterState.CROUCH, FighterState.JUMP_UP,
                    FighterState.JUMP_FORWARD, FighterState.JUMP_BACKWARD].includes(this.opponent.currentState)) {
                    this.opponent.position.x -= 66 * time.secondsPassed;
                }
            }
        }
    }

    handleJumpStartInit() {
        this.handleIdleInit();
    }
    handleJumpLandInit() {
        this.handleIdleInit();
    }

    handleJumpLandState() {
        if(this.animationFrame < 1) return;

        let newState = FighterState.IDLE;

        if(!control.isIdle(this.playerId)) {
            this.direction = this.getDirection();

            this.handleIdleState();
        } else {
            const newDirection = this.getDirection();

            if(newDirection !== this.direction) {
                this.direction = newDirection;
                newState = FighterState.IDLE_TURN;
            }
            else {
                if(this.animations && this.animations[this.currentState][this.animationFrame][1] !== -2) return;
            }
        }
        this.changeState(newState);
    }
    handleJumpStartState() {
        if(this.animations && this.animations[this.currentState][this.animationFrame][1] === -2) {
            if(control.isBackward(this.playerId, this.direction)) {
                this.changeState(FighterState.JUMP_BACKWARD)
            } else if (control.isForward(this.playerId, this.direction)) {
                this.changeState(FighterState.JUMP_FORWARD);
            } else {
                this.changeState(FighterState.JUMP_UP);
            }
        }
    }
    updateAnimation(time : FrameTime) {
        if(this.animations) {

            const animation  = this.animations[this.currentState];

            const [ frameKey, frameDelay] = animation[this.animationFrame];

            if( time.previous > this.animationTimer+frameDelay) {
                this.animationTimer = time.previous;
                if(frameDelay > 0) {
                    this.animationFrame++;
                    this.pushBox = this.getPushBox(frameKey);
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
        this.updateStageContraints(time, context);
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

        const [frameKey] = this.animations[this.currentState][this.animationFrame];
        const pushBox = this.getPushBox(frameKey);

        context.lineWidth = 1;

        // Push Box

        context.beginPath();
        context.strokeStyle = '#55FF55';
        context.fillStyle = '#55FF5555';
        context.fillRect(
            Math.floor(this.position.x + pushBox.x) + 0.5,
            Math.floor(this.position.y + pushBox.y) + 0.5,
            pushBox.width,
            pushBox.height
        );

        context.rect(
            Math.floor(this.position.x + pushBox.x) + 0.5,
            Math.floor(this.position.y + pushBox.y) + 0.5,
            pushBox.width,
            pushBox.height
        );

        context.stroke();




        context.lineWidth = 1;
        context.beginPath();
        context.strokeStyle = 'white';
        context.moveTo(Math.floor(this.position.x-4), Math.floor(this.position.y) -0.5);
        context.lineTo(Math.floor(this.position.x+5), Math.floor(this.position.y) -0.5);
        context.moveTo(Math.floor(this.position.x)+0.5, Math.floor(this.position.y-5));
        context.lineTo(Math.floor(this.position.x)+0.5, Math.floor(this.position.y+4));
        context.stroke();
    }



}
