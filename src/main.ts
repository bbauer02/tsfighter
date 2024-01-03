import './style.css'
import { FrameTime } from './interfaces';
import { Ken } from "./entities/fighters/Ken.ts";
import {Ryu} from "./entities/fighters/Ryu.ts";
import { Stage } from "./entities/Stage.ts";
import { FpsCounter} from "./entities/FpsCounter.ts";
import {STAGE_FLOOR} from "./constants/stage.ts";
import {fighterDirection, fighterState} from "./constants/fighter.ts";
import Fighter from "./entities/fighters/Fighter.ts";

function populateMoveDropdown() :void {
    const dropdown :HTMLElement = <HTMLElement>document.getElementById('state-dropdown');
    Object.entries(fighterState).forEach(([, value ]) => {
        const option :HTMLOptionElement = document.createElement('option');
        option.setAttribute('value', value);
        option.innerText = value;
        dropdown.appendChild(option);
    });
}

function handleFormSubmit(event : Event , fighters : Fighter[]) {
    event.preventDefault();
    const selectedCheckboxes : string[]  = Array
        .from((event.target as HTMLInputElement).querySelectorAll('input:checked') as NodeListOf<HTMLInputElement>)
        .map( (checkbox: HTMLInputElement, _index: number, _array: HTMLInputElement[]) => checkbox.value);

    const options : HTMLInputElement = <HTMLInputElement>(event.target as HTMLInputElement).querySelector('Select');
    fighters.forEach(fighter => {
        if(selectedCheckboxes.includes(fighter.name)) {
            fighter.changeState(options.value)
        }
    })
}

populateMoveDropdown();

const canvas :HTMLCanvasElement = <HTMLCanvasElement>document.querySelector('canvas');
const context: CanvasRenderingContext2D = <CanvasRenderingContext2D>canvas.getContext('2d');
context.imageSmoothingEnabled = false;

const fighters : Fighter[] = [
    new Ryu(104, STAGE_FLOOR, fighterDirection.RIGHT),
    new Ken(280, STAGE_FLOOR, fighterDirection.LEFT),
]

const entities = [
    new Stage(),
    ...fighters,
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

document.addEventListener('submit', (event : Event) => handleFormSubmit(event, fighters));
