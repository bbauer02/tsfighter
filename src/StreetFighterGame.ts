import './style.css'
import { FrameTime, Entity } from './interfaces';
import { Ken } from "./entities/fighters/Ken.ts";
import {Ryu} from "./entities/fighters/Ryu.ts";
import { Stage } from "./entities/Stage.ts";
import { FpsCounter} from "./entities/FpsCounter.ts";
import { STAGE_MID_POINT, STAGE_PADDING} from "./constants/stage.ts";
import Fighter from "./entities/fighters/Fighter.ts";
import {pollGamepads, registerGamePadEvents, registerKeyboardEvents} from './InputHandle.ts';
import {Shadow} from "./entities/fighters/shadow.ts";
import { StatusBar } from './entities/overlays/StatusBar.ts';
import {Camera} from "./camera.ts";
import {getContext} from "./utils/context.ts";

export class StreetFighterGame {

    private context : CanvasRenderingContext2D;

    private fighters : Fighter[];
    private entities: Entity[];
    private frameTime : FrameTime;

    private camera : Camera;
    constructor() {

        this.context = getContext();

        this.fighters = [new Ryu(0), new Ken(1)]

        this.fighters[0].opponent = this.fighters[1];
        this.fighters[1].opponent = this.fighters[0];

        this.camera = new Camera(STAGE_MID_POINT + STAGE_PADDING - (this.context.canvas.width / 2),16, this.fighters);

        this.entities = [
            new Stage(),
            ...this.fighters.map(fighter => new Shadow(fighter)),
            ...this.fighters,
            new FpsCounter(),
            new StatusBar(this.fighters)
        ];

        this.frameTime = {
            previous: 0,
            secondsPassed: 0,
        };


    }



    update() {
        this.camera.update(this.frameTime, this.context);
        for (const entity of this.entities) {
            entity.update(this.frameTime, this.context, this.camera);
        }
    }

    draw() {
        for (const entity of this.entities) {
            entity.draw(this.context, this.camera);
        }
    }

     frame (time : number) : void {
        window.requestAnimationFrame(this.frame.bind(this));
        this.frameTime = {
            secondsPassed : (time - this.frameTime.previous) / 1000,
            previous : time
        }
        pollGamepads();
        this.update();
        this.draw();
     }

     handleFormSubmit(event : Event) {
        event.preventDefault();
        const selectedCheckboxes : string[]  = Array
            .from((event.target as HTMLInputElement).querySelectorAll('input:checked') as NodeListOf<HTMLInputElement>)
            .map( (checkbox: HTMLInputElement, _index: number, _array: HTMLInputElement[]) => checkbox.value);

        const options : HTMLInputElement = <HTMLInputElement>(event.target as HTMLInputElement).querySelector('Select');
        this.fighters.forEach(fighter => {
            if(selectedCheckboxes.includes(fighter.name)) {
                fighter.changeState(options.value)
            }
        })
    }

    start() {
        registerKeyboardEvents();
        registerGamePadEvents();
        window.requestAnimationFrame(this.frame.bind(this));
    }


}