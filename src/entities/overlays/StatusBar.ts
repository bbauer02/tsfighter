import { FrameTime } from "../../interfaces";
import Fighter from "../fighters/Fighter";
import {
    TIME_DELAY,
    TIME_FRAME_KEYS,
    TIME_FLASH_DELAY,
    HEALTH_MAX_HIT_POINTS,
    HEALTH_DAMAGE_COLOR
} from '../../constants/battle.ts';
import {drawFrame} from "../../utils/context.ts";
import {gameState} from "../../state/gameState.ts";
import {FPS} from "../../constants/game.ts";
export class StatusBar {

    private image: HTMLImageElement;
    private time : number;
    private timeTimer : number;
    private frames: Map<string, number[]>;
    private fighters : Fighter[];
    private timeFlashTimer : number = 0;
    private useFlashFrames : boolean = false;

    private healthBars = [
        {
        timer:0,
        hitPoints: HEALTH_MAX_HIT_POINTS,
        },
        {
            timer:0,
            hitPoints: HEALTH_MAX_HIT_POINTS,
        }
    ];

    private names : string[]
    constructor(fighters : Fighter[]) {
        this.image = <HTMLImageElement>document.querySelector('img[alt="misc"');
        this.time = 99;
        this.timeTimer = 0;
        this.fighters = fighters;

        this.frames = new Map([
            ["health-bar", [16, 18, 145, 11]],

            ["ko-white", [161, 16, 32, 14]],
            ["ko-red", [161, 1, 32, 14]],

            [`${TIME_FRAME_KEYS[0]}-0`, [16, 32, 14, 16]],
            [`${TIME_FRAME_KEYS[0]}-1`, [32, 32, 14, 16]],
            [`${TIME_FRAME_KEYS[0]}-2`, [48, 32, 14, 16]],
            [`${TIME_FRAME_KEYS[0]}-3`, [64, 32, 14, 16]],
            [`${TIME_FRAME_KEYS[0]}-4`, [80, 32, 14, 16]],
            [`${TIME_FRAME_KEYS[0]}-5`, [96, 32, 14, 16]],
            [`${TIME_FRAME_KEYS[0]}-6`, [112, 32, 14, 16]],
            [`${TIME_FRAME_KEYS[0]}-7`, [128, 32, 14, 16]],
            [`${TIME_FRAME_KEYS[0]}-8`, [144, 32, 14, 16]],
            [`${TIME_FRAME_KEYS[0]}-9`, [160, 32, 14, 16]],

            [`${TIME_FRAME_KEYS[1]}-0`, [16, 192, 14, 16]],
            [`${TIME_FRAME_KEYS[1]}-1`, [32, 192, 14, 16]],
            [`${TIME_FRAME_KEYS[1]}-2`, [48, 192, 14, 16]],
            [`${TIME_FRAME_KEYS[1]}-3`, [64, 192, 14, 16]],
            [`${TIME_FRAME_KEYS[1]}-4`, [80, 192, 14, 16]],
            [`${TIME_FRAME_KEYS[1]}-5`, [96, 192, 14, 16]],
            [`${TIME_FRAME_KEYS[1]}-6`, [112, 192, 14, 16]],
            [`${TIME_FRAME_KEYS[1]}-7`, [128, 192, 14, 16]],
            [`${TIME_FRAME_KEYS[1]}-8`, [144, 192, 14, 16]],
            [`${TIME_FRAME_KEYS[1]}-9`, [160, 192, 14, 16]],

            // NAME TAGS
            ["tag-ken", [128, 56, 30, 9]],
            ["tag-ryu", [16, 56, 28, 9]],


        ]);
        const [ {name: name1}, {name: name2}] = this.fighters;
        this.names = [`tag-${name1.toLowerCase()}`,`tag-${name2.toLowerCase()}`]
    }

    drawFrame(context:CanvasRenderingContext2D, frameKey : string, x : number, y :number, direction = 1 ) {

        drawFrame(context, this.image, this.frames.get(frameKey) ?? [], x, y, direction);

    }

    updateTime(time : FrameTime) {
        if(time.previous > this.timeTimer + TIME_DELAY) {
            this.time -= 1;
            this.timeTimer = time.previous;
        }

        if(this.time < 15 && this.time > -1 && time.previous > this.timeFlashTimer + TIME_FLASH_DELAY) {
            this.useFlashFrames = !this.useFlashFrames;
            this.timeFlashTimer = time.previous;
        }
    }

    updateHealthBars(time : FrameTime) {
        for(const index in this.healthBars) {
            if(this.healthBars[index].hitPoints <= gameState.fighters[index].hitPoints) continue;
            this.healthBars[index].hitPoints = Math.max(0, this.healthBars[index].hitPoints - (time.secondsPassed * FPS));
        }
    }
    update(time : FrameTime) {
        this.updateTime(time);
        this.updateHealthBars(time);
    }

    drawHealthBars(context : CanvasRenderingContext2D) {
        this.drawFrame(context, 'health-bar', 31, 20 );
        this.drawFrame(context, 'ko-white', 176, 18 );
        this.drawFrame(context, 'health-bar', 353, 20,-1 );

        context.fillStyle = HEALTH_DAMAGE_COLOR;

        context.beginPath();
        context.fillRect(
            32,21,
            HEALTH_MAX_HIT_POINTS - Math.floor(this.healthBars[0].hitPoints),9
        );

        context.fillRect(
            208 + Math.floor(this.healthBars[1].hitPoints),21,
            HEALTH_MAX_HIT_POINTS - Math.floor(this.healthBars[1].hitPoints),9
        );
    }

    drawTime(context : CanvasRenderingContext2D) {
        const timeString  = String(Math.max(this.time,0)).padStart(2,'00');
        const flashframe = TIME_FRAME_KEYS[Number(this.useFlashFrames)];

        this.drawFrame(context,  `${flashframe}-${timeString.charAt(0)}`, 178,33);
        this.drawFrame(context,  `${flashframe}-${timeString.charAt(1)}`, 194,33);

    }

    drawNametags(context : CanvasRenderingContext2D) {
        const [name1, name2 ]   = this.names;
        this.drawFrame(context,name1 , 32,33);
        this.drawFrame(context, name2, 322,33);
    }
    draw(context : CanvasRenderingContext2D) {
        this.drawHealthBars(context);
        this.drawNametags(context);
        this.drawTime(context);

    }
}