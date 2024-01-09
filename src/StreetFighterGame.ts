import './style.css'
import { FrameTime, Entity } from './interfaces';
import { Ken } from "./entities/fighters/Ken.ts";
import {Ryu} from "./entities/fighters/Ryu.ts";
import { Stage } from "./entities/Stage.ts";
import { FpsCounter} from "./entities/FpsCounter.ts";
import {STAGE_FLOOR} from "./constants/stage.ts";
import {fighterDirection} from "./constants/fighter.ts";
import Fighter from "./entities/fighters/Fighter.ts";
import {pollGamepads, registerGamePadEvents, registerKeyboardEvents} from './InputHandle.ts';
import {Shadow} from "./entities/fighters/shadow.ts";
import { StatusBar } from './entities/overlays/StatusBar.ts';

export class StreetFighterGame {

    private context : CanvasRenderingContext2D;

    private fighters : Fighter[];
    private entities: Entity[];
    private frameTime : FrameTime;
    constructor() {

        this.context = this.getContext();

        this.fighters = [
            new Ryu(104, STAGE_FLOOR, fighterDirection.RIGHT, 0),
            new Ken(280, STAGE_FLOOR, fighterDirection.LEFT, 1),
        ]

        this.fighters[0].opponent = this.fighters[1];
        this.fighters[1].opponent = this.fighters[0];


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

    getContext() :CanvasRenderingContext2D {
        const canvas :HTMLCanvasElement = <HTMLCanvasElement>document.querySelector('canvas');
        const context :CanvasRenderingContext2D = <CanvasRenderingContext2D>canvas.getContext('2d');
        context.imageSmoothingEnabled = false;
        return context
    }

    update() {
        for (const entity of this.entities) {
            entity.update(this.frameTime, this.context);
        }
    }

    draw() {
        for (const entity of this.entities) {
            entity.draw(this.context);
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