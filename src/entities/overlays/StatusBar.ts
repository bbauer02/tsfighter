import { FrameTime } from "../../interfaces";
import Fighter from "../fighters/Fighter";

export class StatusBar {

    private image: HTMLImageElement;
    private time : number;
    private timeTimer : number;
    private frames: Map<string, number[]>;
    private fighters : Fighter[];

    constructor(fighters : Fighter[]) {
        this.image = <HTMLImageElement>document.querySelector('img[alt="misc"');
        this.time = 99;
        this.timeTimer = 0;
        this.fighters = fighters;

        this.frames = new Map([
            ["health-bar", [16, 18, 145, 11]],

            ["ko-white", [161, 16, 32, 14]],
            ["ko-red", [161, 1, 32, 14]],

            [`time-0`, [16, 32, 14, 16]],
            [`time-1`, [32, 32, 14, 16]],
            [`time-2`, [48, 32, 14, 16]],
            [`time-3`, [64, 32, 14, 16]],
            [`time-4`, [80, 32, 14, 16]],
            [`time-5`, [96, 32, 14, 16]],
            [`time-6`, [112, 32, 14, 16]],
            [`time-7`, [128, 32, 14, 16]],
            [`time-8`, [144, 32, 14, 16]],
            [`time-9`, [160, 32, 14, 16]],

            // NAME TAGS
            ["tag-ken", [128, 56, 30, 9]],
            ["tag-ryu", [16, 56, 28, 9]],
        ])
    }

    drawFrame(context:CanvasRenderingContext2D, frameKey : string, x : number, y :number, direction = 1 ) {
        const [sourceX, sourceY, sourceWidth, sourceHeight] = this.frames.get(frameKey) ?? [];

        context.scale(direction, 1);
        context.drawImage(
            this.image, 
            sourceX, sourceY, sourceWidth, sourceHeight,
            x * direction, y, sourceWidth, sourceHeight,
        );
        context.setTransform(1,0,0,1,0,0);

    }

    update(time : FrameTime) {

    }

    drawHealthBars(context : CanvasRenderingContext2D) {
        
    }

    draw(context : CanvasRenderingContext2D) {
        this.drawFrame(context, 'health-bar', 31, 20 );
        this.drawFrame(context, 'ko-white', 176, 18 );
        this.drawFrame(context, 'health-bar', 353, 20,-1 );

        const timeString = String(this.time).padStart(2, '00');

        this.drawFrame(context, `time-${timeString.charAt(0)}`, 178,33);
        this.drawFrame(context, `time-${timeString.charAt(1)}`, 194,33);

        const [ {name: name1}, {name: name2}] = this.fighters;

        this.drawFrame(context, `tag-${name1.toLowerCase()}`, 32,33);
        this.drawFrame(context, `tag-${name2.toLowerCase()}`, 322,33);

    }
}