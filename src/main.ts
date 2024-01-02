import './style.css'
import { GameViewport } from './interfaces';
import { Ken } from "./entities/fighters/Ken.ts";
import {Ryu} from "./entities/fighters/Ryu.ts";
import { Stage } from "./entities/Stage.ts";
import { FpsCounter} from "./entities/FpsCounter.ts";

const gameViewport : GameViewport = {
    WIDTH: 384,
    HEIGHT: 224
}


const canvas :HTMLCanvasElement = <HTMLCanvasElement>document.querySelector('canvas');
const context: CanvasRenderingContext2D = <CanvasRenderingContext2D>canvas.getContext('2d');

canvas.width = gameViewport.WIDTH;
canvas.height = gameViewport.HEIGHT;

const entities = [
    new Stage(),
    new Ken(80, 110, 150),
    new Ryu(80, 110, -150),
    new FpsCounter()
];

let previousTime :number = 0;
let secondsPassed :number = 0;

function animate (time : number) : void {
    requestAnimationFrame(animate);
    secondsPassed = (time - previousTime) / 1000;
    previousTime = time;

    for (const entity of entities) {
        entity.update(secondsPassed, context);
        entity.draw(context);
    }
}

animate(0);