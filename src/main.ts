import './style.css'
import { GameViewport } from './interfaces';
import { Ken } from "./entities/Ken.ts";
import {Ryu} from "./entities/Ryu.ts";
import { Stage } from "./entities/Stage.ts";

const gameViewport : GameViewport = {
    WIDTH: 384,
    HEIGHT: 224
}


const canvas :HTMLCanvasElement = <HTMLCanvasElement>document.querySelector('canvas');
const context: CanvasRenderingContext2D = <CanvasRenderingContext2D>canvas.getContext('2d');

canvas.width = gameViewport.WIDTH;
canvas.height = gameViewport.HEIGHT;

const ken = new Ken(80, 110, 1);
const ryu = new Ryu(80, 110, -1);

const stage = new Stage();


function animate () {

    stage.draw(context);

    ken.update(context);
    ken.draw(context);

    ryu.update(context);
    ryu.draw(context);

    requestAnimationFrame(animate);
}

animate();