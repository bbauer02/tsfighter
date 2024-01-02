import './style.css'
import { GameViewport } from './interfaces';
import { drawKen, updateKen } from "./ken.ts";
import { drawBackground } from  "./stage.ts";

import {drawRyu, updateRyu} from "./ryu.ts";

const gameViewport : GameViewport = {
    WIDTH: 384,
    HEIGHT: 224
}


const canvas :HTMLCanvasElement = <HTMLCanvasElement>document.querySelector('canvas');
const context: CanvasRenderingContext2D = <CanvasRenderingContext2D>canvas.getContext('2d');

canvas.width = gameViewport.WIDTH;
canvas.height = gameViewport.HEIGHT;



function animate () {
    drawBackground(context);
    updateKen(context);
    drawKen(context);

    updateRyu(context);
    drawRyu(context);

    requestAnimationFrame(animate);
}

animate();