import './style.css'
import { GameViewport, FrameTime } from './interfaces';
import { Ken } from "./entities/fighters/Ken.ts";
import {Ryu} from "./entities/fighters/Ryu.ts";
import { Stage } from "./entities/Stage.ts";
import { FpsCounter} from "./entities/FpsCounter.ts";
import {STAGE_FLOOR} from "./constants/stage.ts";
import {fighterDirection} from "./constants/fighter.ts";

const canvas :HTMLCanvasElement = <HTMLCanvasElement>document.querySelector('canvas');
const context: CanvasRenderingContext2D = <CanvasRenderingContext2D>canvas.getContext('2d');
context.imageSmoothingEnabled = false;

const entities = [
    new Stage(),
    new Ken(280, STAGE_FLOOR, fighterDirection.LEFT),
    new Ryu(104, STAGE_FLOOR, fighterDirection.RIGHT),
    new FpsCounter()
];

let frameTime :FrameTime  = {
    previous: 0,
    secondsPassed: 0,
};


function animate (time : number) : void {
    requestAnimationFrame(animate);
    frameTime = {
        secondsPassed : (time - frameTime.previous) / 1000,
        previous : time
    }


    for (const entity of entities) {
        entity.update(frameTime, context);
        entity.draw(context);
    }
}

animate(0);