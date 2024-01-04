import {Control, controls} from "./constants/control.ts";
import {fighterDirection} from "./constants/fighter.ts";

const heldKeys : Set<string> = new Set();
function handleKeyDown(event : KeyboardEvent) : void {
    event.preventDefault();

    heldKeys.add(event.code);
}


function handleKeyUp(event : KeyboardEvent) :void {
    event.preventDefault();

    heldKeys.delete(event.code);
}
export function registerKeyboardEvents() {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
}


export const isKeyDown  = (code:string) : boolean => heldKeys.has(code);
export const isKeyUp  = (code:string) : boolean => !heldKeys.has(code);

export const isLeft = (id : number) => isKeyDown(controls[id].keyboard[Control.LEFT]);
export const isRight = (id : number) => isKeyDown(controls[id].keyboard[Control.RIGHT]);
export const isUp = (id : number) => isKeyDown(controls[id].keyboard[Control.UP]);
export const isDown = (id : number) => isKeyDown(controls[id].keyboard[Control.DOWN]);

export const isForward = (id : number, direction : number) => direction === fighterDirection.RIGHT ? isRight(id) : isLeft(id);
export const isBackward = (id : number, direction : number) => direction === fighterDirection.LEFT ? isRight(id) : isLeft(id);
