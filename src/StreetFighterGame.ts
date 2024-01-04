import './style.css'
import { FrameTime, Entity } from './interfaces';
import { Ken } from "./entities/fighters/Ken.ts";
import {Ryu} from "./entities/fighters/Ryu.ts";
import { Stage } from "./entities/Stage.ts";
import { FpsCounter} from "./entities/FpsCounter.ts";
import {STAGE_FLOOR} from "./constants/stage.ts";
import {fighterDirection} from "./constants/fighter.ts";
import Fighter from "./entities/fighters/Fighter.ts";


export class StreetFighterGame {

    private context : CanvasRenderingContext2D;

    private fighters : Fighter[];
    private entities: Entity[];
    private frameTime : FrameTime;
    constructor() {

        this.context = this.getContext();

        this.fighters = [
            new Ryu(104, STAGE_FLOOR, fighterDirection.RIGHT),
            new Ken(280, STAGE_FLOOR, fighterDirection.LEFT),
        ]
        this.entities = [
            new Stage(),
            ...this.fighters,
            new FpsCounter()
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
        window.requestAnimationFrame(this.frame.bind(this));
    }


}