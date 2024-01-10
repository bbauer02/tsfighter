import {FighterAnimations, FrameTime, Position, Velocity} from '../../interfaces';
import {
    FIGHTER_START_DISTANCE,
    fighterDirection,
    FighterState,
    FrameDelay,
    PUSH_FRICTION,
    FighterAttackType, FighterAttackStrength, FighterAttackBaseData
} from "../../constants/fighter.ts";
import InitialVelocity from "../../interfaces/InitialVelocity.ts";
import {STAGE_FLOOR, STAGE_MID_POINT, STAGE_PADDING} from "../../constants/stage.ts";
import * as control from "../../InputHandle.ts";
import {boxOverlap, getActualBoxDimentions, rectsOverlap} from "../../utils/collisions.ts";
import frameTime from "../../interfaces/FrameTime.ts";
import {Camera} from "../../camera.ts";
import {gameState} from "../../state/gameState.ts";



export default class Fighter {

    private playerId : number;
    private readonly _name: string;
    protected image: HTMLImageElement;
    protected frames: Map<string, number[][]>;
    position: Position;
    velocity : Velocity;
    protected initialVelocity : InitialVelocity | undefined;
    private animationFrame : number;
    private animationTimer : number;
    private currentState : FighterState;
    protected animations: FighterAnimations | undefined;
    direction;
    protected gravity: number;
    protected states;
    opponent : Fighter | undefined = undefined;

    private attackStruck = false;

    boxes = {
        push: {x: 0, y:0, width:0, height:0},
        hurt: [[0,0,0,0], [0,0,0,0], [0,0,0,0]],
        hit: {x: 0, y:0, width:0, height:0},

    };

    // @ts-ignore
    constructor(name: string,playerId : number) {
        this.playerId = playerId;
        this._name = name;
        this.position  = {
            x : STAGE_MID_POINT + STAGE_PADDING + (playerId ===0 ? - FIGHTER_START_DISTANCE : FIGHTER_START_DISTANCE) ,
            y : STAGE_FLOOR
        };
        this.image = new Image();
        this.velocity = {x:0 ,y:0};
        this.initialVelocity = undefined;
        this.frames= new Map();
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.currentState = FighterState.IDLE;
        this.animations = undefined;
        this.direction = playerId ===0 ? fighterDirection.RIGHT : fighterDirection.LEFT;
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
                    FighterState.CROUCH_UP, FighterState.JUMP_LAND, FighterState.IDLE_TURN,
                    FighterState.LIGHT_PUNCH, FighterState.MEDIUM_PUNCH, FighterState.HEAVY_PUNCH,
                    FighterState.LIGHT_KICK, FighterState.MEDIUM_KICK, FighterState.HEAVY_KICK
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
            [FighterState.LIGHT_PUNCH] : {
                attackType: FighterAttackType.PUNK,
                attackStrength : FighterAttackStrength.LIGHT,
                init: this.handleStandardLightAttackInit.bind(this),
                update: this.handleLightPunchState.bind(this),
                validFrom : [FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD],
            },
            [FighterState.MEDIUM_PUNCH] : {
                attackType: FighterAttackType.PUNK,
                attackStrength : FighterAttackStrength.MEDIUM,
                init: this.handleStandardMediumAttackInit.bind(this),
                update: this.handleMediumPunchState.bind(this),
                validFrom : [FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD],
            },
            [FighterState.HEAVY_PUNCH] : {
                attackType: FighterAttackType.PUNK,
                attackStrength : FighterAttackStrength.MEDIUM,
                init: this.handleStandardHeavyAttackInit.bind(this),
                update: this.handleMediumPunchState.bind(this),
                validFrom : [FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD],
            },
            [FighterState.LIGHT_KICK] : {
                attackType: FighterAttackType.KICK,
                attackStrength : FighterAttackStrength.LIGHT,
                init: this.handleStandardLightAttackInit.bind(this),
                update: this.handleLightKickState.bind(this),
                validFrom : [FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD],
            },
            [FighterState.MEDIUM_KICK] : {
                attackType: FighterAttackType.KICK,
                attackStrength : FighterAttackStrength.MEDIUM,
                init: this.handleStandardMediumAttackInit.bind(this),
                update: this.handleMediumKickState.bind(this),
                validFrom : [FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD],
            },
            [FighterState.HEAVY_KICK] : {
                attackType: FighterAttackType.KICK,
                attackStrength : FighterAttackStrength.HEAVY,
                init: this.handleStandardHeavyAttackInit.bind(this),
                update: this.handleMediumKickState.bind(this),
                validFrom : [FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD],
            },
        }

        this.changeState(FighterState.IDLE);
    }

    handleCrounchDownInit = () => {
        this.resetVelocity();
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
        if(this.isAnimationCompleted()) {
            this.changeState(FighterState.CROUCH);
        }

        if(!control.isDown(this.playerId) && this.animations) {
            this.currentState= FighterState.CROUCH_UP;
            this.animationFrame = this.animations[FighterState.CROUCH_UP][this.animationFrame].length - this.animationFrame;
        }
    }

    handleCrouchUpState = () => {
        if(this.isAnimationCompleted()) {
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
        this.resetVelocity();
        this.attackStruck = false;
    }
    handleIdleState = () => {
        if(control.isUp(this.playerId)) {
            this.changeState(FighterState.JUMP_START);
        }
        else if(control.isDown(this.playerId)) {
            this.changeState(FighterState.CROUCH_DOWN);
        }
        else if(control.isBackward(this.playerId, this.direction)) {
            this.changeState(FighterState.WALK_BACKWARD);
        }
        else if(control.isForward(this.playerId, this.direction)) {
            this.changeState(FighterState.WALK_FORWARD);
        } else if(control.isLightPunch(this.playerId)) {
            this.changeState(FighterState.LIGHT_PUNCH);
        }
        else if(control.isMediumPunch(this.playerId)) {
            this.changeState(FighterState.MEDIUM_PUNCH);
        }
        else if(control.isHeavyPunch(this.playerId)) {
            this.changeState(FighterState.HEAVY_PUNCH);
        }
        else if(control.isLightKick(this.playerId)) {
            this.changeState(FighterState.LIGHT_KICK);
        }
        else if(control.isMediumKick(this.playerId)) {
            this.changeState(FighterState.MEDIUM_KICK);
        }
        else if(control.isHeavyKick(this.playerId)) {
            this.changeState(FighterState.HEAVY_KICK);
        }


        const newDirection = this.getDirection();

        if(newDirection !== this.direction) {
            this.direction = newDirection;
            this.changeState(FighterState.IDLE_TURN);
        }
    }

    handleWalkForwardState = () => {
        if(!control.isForward(this.playerId, this.direction)) {
            this.changeState(FighterState.IDLE);
        }
        else if(control.isUp(this.playerId)) {
            this.changeState(FighterState.JUMP_START);
        }
        else if(control.isDown(this.playerId)) {
            this.changeState(FighterState.CROUCH_DOWN);
        }

        if(control.isLightPunch(this.playerId)) {
            this.changeState(FighterState.LIGHT_PUNCH);
        }
        else if(control.isMediumPunch(this.playerId)) {
            this.changeState(FighterState.MEDIUM_PUNCH);
        }
        else if(control.isHeavyPunch(this.playerId)) {
            this.changeState(FighterState.HEAVY_PUNCH);
        }
        else if(control.isLightKick(this.playerId)) {
            this.changeState(FighterState.LIGHT_KICK);
        }
        else if(control.isMediumKick(this.playerId)) {
            this.changeState(FighterState.MEDIUM_KICK);
        }
        else if(control.isHeavyKick(this.playerId)) {
            this.changeState(FighterState.HEAVY_KICK);
        }

        this.direction = this.getDirection();

    }

    handleWalkBackwardState = () => {
        if(!control.isBackward(this.playerId, this.direction)) {
            this.changeState(FighterState.IDLE);
        }
        else if(control.isUp(this.playerId)) {
            this.changeState(FighterState.JUMP_START);
        }
        else if(control.isDown(this.playerId)) {
            this.changeState(FighterState.CROUCH_DOWN);
        }

        if(control.isLightPunch(this.playerId)) {
            this.changeState(FighterState.LIGHT_PUNCH);
        }
        else if(control.isMediumPunch(this.playerId)) {
            this.changeState(FighterState.MEDIUM_PUNCH);
        }
        else if(control.isHeavyPunch(this.playerId)) {
            this.changeState(FighterState.HEAVY_PUNCH);
        }
        else if(control.isLightKick(this.playerId)) {
            this.changeState(FighterState.LIGHT_KICK);
        }
        else if(control.isMediumKick(this.playerId)) {
            this.changeState(FighterState.MEDIUM_KICK);
        }
        else if(control.isHeavyKick(this.playerId)) {
            this.changeState(FighterState.HEAVY_KICK);
        }

        this.direction = this.getDirection();

    }

    handleIdleTurnState() {
        this.handleIdleState();
       if(!this.isAnimationCompleted()) return;
        this.changeState(FighterState.IDLE);
    }

    handleCrouchTurnState() {
        this.handleCrounchState();

        if(!this.isAnimationCompleted()) return;
        this.changeState(FighterState.CROUCH);
    }

    handleStandardLightAttackInit() {
        this.handleIdleInit();
    }

    handleStandardMediumAttackInit() {
        this.resetVelocity();
    }
    handleStandardHeavyAttackInit() {
        this.resetVelocity();
    }


    handleLightPunchState()  {
        if(this.animationFrame <2) return;
        if(control.isLightPunch(this.playerId)) this.animationFrame = 0;

        if(!this.isAnimationCompleted()) return;
        this.changeState(FighterState.IDLE);

    }
    handleMediumPunchState() {
        if(!this.isAnimationCompleted()) return;
        this.changeState(FighterState.IDLE);
    }
    handleHeavyPunchState() {
        if(!this.isAnimationCompleted()) return;
        this.changeState(FighterState.IDLE);
    }

    handleLightKickState()  {
        if(this.animationFrame <2) return;
        if(control.isLightKick(this.playerId)) this.animationFrame = 0;

        if(!this.isAnimationCompleted()) return;
        this.changeState(FighterState.IDLE);

    }
    handleMediumKickState() {
        if(!this.isAnimationCompleted()) return;
        this.changeState(FighterState.IDLE);
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
            this.position.x + this.boxes.push.x,
            this.position.y + this.boxes.push.y,
            this.boxes.push.width,
            this.boxes.push.height,
            this.opponent.position.x + this.boxes.push.x,
            this.opponent.position.y! + this.boxes.push.y,
            this.opponent.boxes.push.width,
            this.opponent.boxes.push.height
        );

    isAnimationCompleted = () => this.animations && this.animations[this.currentState][this.animationFrame][1] ===  FrameDelay.TRANSITION;

    resetVelocity() {
        this.velocity.x = 0;
        this.velocity.y = 0;
    }

    getDirection = () => {
        if(  this.opponent&&this.position.x + this.boxes.push.width
            <= this.opponent.position.x + this.opponent.boxes.push.x) {
            return fighterDirection.RIGHT;
        } else if ( this.opponent&&this.position.x + this.boxes.push.x
            >= this.opponent.position.x + this.opponent?.boxes.push.x + this.opponent?.boxes.push.width ) {
            return fighterDirection.LEFT;
        }
            return this.direction;
    }

    getBoxes(frameKey: string) {
        const framesData = this.frames.get(frameKey);

        if(framesData) {
            const [,,
                [pushX=0,pushY=0,pushWidth=0, pushHeight=0] = [],
                [head = [0,0,0,0], body=[0,0,0,0], feet=[0,0,0,0]] = [],
                [hitX=0,hitY=0,hitWidth=0, hitHeight=0] = [],
            ] = framesData;
            return {
               push: {x :pushX, y :pushY , width :pushWidth , height : pushHeight},
               hurt: [head, body, feet],
               hit: {x :hitX, y :hitY , width :hitWidth , height : hitHeight},

            }
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


    updateStageConstraints(time : frameTime, context : CanvasRenderingContext2D, camera : Camera) {

        if (this.position.x > camera.position.x + context.canvas.width - this.boxes.push.width ) {
            this.position.x = camera.position.x + context.canvas.width - this.boxes.push.width;
        }

        if (this.position.x < camera.position.x + this.boxes.push.width ) {
            this.position.x = camera.position.x + this.boxes.push.width;
        }

        if(this.opponent&&this.hasCollidedWithOpponent()) {
            if(this.position.x <= this.opponent.position.x) {
                this.position.x = Math.max(
                    (this.opponent.position.x + this.opponent.boxes.push.x) - (this.boxes.push.x + this.boxes.push.width),
                    camera.position.x + this.boxes.push.width
                );

                if([
                    FighterState.IDLE, FighterState.CROUCH, FighterState.JUMP_UP,
                    FighterState.JUMP_FORWARD, FighterState.JUMP_BACKWARD].includes(this.opponent.currentState)) {
                    this.opponent.position.x += PUSH_FRICTION * time.secondsPassed;
                }
            }

            if(this.position.x >= this.opponent.position.x) {
                this.position.x = Math.min(
                    (this.opponent.position.x + this.opponent.boxes.push.x + this.opponent.boxes.push.width)
                    + (this.boxes.push.width + this.boxes.push.x ),
                    camera.position.x +context.canvas.width - this.boxes.push.width,
                );

                if([
                    FighterState.IDLE, FighterState.CROUCH, FighterState.JUMP_UP,
                    FighterState.JUMP_FORWARD, FighterState.JUMP_BACKWARD].includes(this.opponent.currentState)) {
                    this.opponent.position.x -= PUSH_FRICTION * time.secondsPassed;
                }
            }
        }
    }

    handleJumpStartInit() {
        this.resetVelocity();
    }
    handleJumpLandInit() {
        this.resetVelocity();
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
                if(!this.isAnimationCompleted()) return;
            }
        }
        this.changeState(newState);
    }
    handleJumpStartState() {
        if(this.isAnimationCompleted()) {
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

            if( time.previous <= this.animationTimer+frameDelay) return;
            this.animationTimer = time.previous;

            if(frameDelay <= FrameDelay.FREEZE) return;
            this.animationFrame++;

            if(this.animationFrame >= animation.length) this.animationFrame = 0;
            this.boxes = this.getBoxes(animation[this.animationFrame][0]);
        }
    }

    updateAttackBoxCollided() {
        if(!this.states[this.currentState].attackType || this.attackStruck ) return;

        const actualHitBox = getActualBoxDimentions(this.position, this.direction, this.boxes.hit);
        for(const hurt of this.opponent.boxes.hurt) {
            const [x, y, width, height] = hurt;
            const actualOpponentHurtBox = getActualBoxDimentions(
                this.opponent?.position,
                this.opponent?.direction,
                {x, y, width, height}
            );

            if(!boxOverlap(actualHitBox, actualOpponentHurtBox)) return;

            const hurtIndex = this.opponent.boxes.hurt.indexOf(hurt);
            const hurtName = ['head', 'body', 'feet'];
            const strength = this.states[this.currentState].attackStrength;


            gameState.fighters[this.playerId].score += FighterAttackBaseData[strength].score;
            gameState.fighters[this.opponent!!.playerId].hitPoints -= FighterAttackBaseData[strength].damage;
            this.attackStruck = true;
            // console.log(`${this.name} has hit ${this.opponent.name} 's ${hurtName[hurtIndex]}`);
            return;

        }
    }
    update(time : FrameTime, context: CanvasRenderingContext2D, camera : Camera) {
        this.position.x += (this.velocity.x * this.direction) * time.secondsPassed;
        this.position.y += this.velocity.y * time.secondsPassed;

        this.states[this.currentState].update(time, context);
        this.updateAnimation(time);
        this.updateStageConstraints(time, context, camera);
        this.updateAttackBoxCollided(time);
    }



    draw(context: CanvasRenderingContext2D, camera : Camera) {
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
                Math.floor((this.position.x - camera.position.x) * this.direction) - originX,
                Math.floor(this.position.y - camera.position.y) - originY,
                width, height);
            context.setTransform(1,0,0,1,0,0);

             this.drawDebug(context, camera);
        }
    }


    drawDebugBox(context: CanvasRenderingContext2D, camera: Camera, dimensions, baseColor) {
        if(!Array.isArray(dimensions)) return;

        const [x=0, y = 0, width = 0, height=0] = dimensions;

        context.beginPath();
        context.strokeStyle = baseColor + 'AA';
        context.fillStyle = baseColor + '44';
        context.fillRect(
            Math.floor(this.position.x + (x*this.direction) - camera.position.x) +0.5,
            Math.floor(this.position.y + y - camera.position.y) + 0.5,
            width * this.direction,
            height
        );

        context.rect(
            Math.floor(this.position.x + (x*this.direction) - camera.position .x) +0.5,
            Math.floor(this.position.y + y - camera.position.y) +0.5,
            width * this.direction,
            height
        );
        context.stroke();
    }

    drawDebug(context: CanvasRenderingContext2D, camera: Camera) {
        if(!this.animations) return;
        const [frameKey] = this.animations[this.currentState][this.animationFrame];
        const boxes = this.getBoxes(frameKey);

        context.lineWidth = 1;


        // pushbox
        this.drawDebugBox(context, camera,Object.values(boxes.push), '#55FF55');

        // Hurt Boxes
        for(const hurtBox of boxes.hurt!!) {
            this.drawDebugBox(context, camera,hurtBox, '#7777FF');
        }

        // bitbox
        this.drawDebugBox(context, camera,Object.values(boxes.hit), '#FF0000');


        // origin
        context.lineWidth = 1;
        context.beginPath();
        context.strokeStyle = 'white';
        context.moveTo(
            Math.floor(this.position.x - camera.position.x -4),
            Math.floor(this.position.y - camera.position.y) -0.5
        );
        context.lineTo(
            Math.floor(this.position.x - camera.position.x) +5,
            Math.floor(this.position.y -camera.position.y) -0.5);
        context.moveTo(
            Math.floor(this.position.x - camera.position.x )+0.5,
            Math.floor(this.position.y - camera.position.y -5));
        context.lineTo(
            Math.floor(this.position.x - camera.position.x )+0.5,
            Math.floor(this.position.y - camera.position.y+4));
        context.stroke();
    }



}
