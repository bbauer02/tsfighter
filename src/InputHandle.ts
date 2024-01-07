import {Control, controls} from "./constants/control.ts";
import {fighterDirection} from "./constants/fighter.ts";

const heldKeys : Set<string> = new Set();
const gamePads = new Map();

const mappedKeys = controls.map(({keyboard}) => Object.values(keyboard) ).flat();
function handleKeyDown(event : KeyboardEvent) : void {

    if(!mappedKeys.includes(event.code)) return;

    event.preventDefault();

    heldKeys.add(event.code);
}


function handleKeyUp(event : KeyboardEvent) :void {

    if(!mappedKeys.includes(event.code)) return;

    event.preventDefault();

    heldKeys.delete(event.code);
}
export function registerKeyboardEvents() {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
}


function handleGamepadConnected(event : GamepadEvent ) {
    const { gamepad : {index, axes, buttons }} = event;
    gamePads.set(index, {axes, buttons});
}

function handleGamepadDisconnected(event : GamepadEvent ) {
    const { gamepad : {index}} = event;
    gamePads.delete(index);
}

export function registerGamePadEvents() {
    window.addEventListener('gamepadconnected', handleGamepadConnected);
    window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);
}


export function pollGamepads() {

    for(const gamePad   of navigator.getGamepads()) {
        if(!gamePad) continue;
        if( gamePads.has(gamePad.index)) {
            const { index, axes, buttons } = gamePad;

            gamePads.set(index, {axes, buttons});
        }
    }
}


export const isKeyDown  = (code:string) : boolean => heldKeys.has(code);
export const isKeyUp  = (code:string) : boolean => !heldKeys.has(code);

export const isButtonDown = (padId :number , button:number) => {
    return gamePads.get(padId)?.buttons[button].pressed
};
export const isButtonUp = (padId :number, button :number) => !gamePads.get(padId)?.buttons[button].pressed;

export const isAxeGreater = (padId:number, axeId:number, value:number) => gamePads.get(padId)?.axes[axeId] >= value;
export const isAxeLower = (padId:number, axeId:number, value:number) => gamePads.get(padId)?.axes[axeId] <= value;

export const isLeft = (id : number) => isKeyDown(controls[id].keyboard[Control.LEFT])
    || isButtonDown(id, controls[id].gamePad[Control.LEFT])
   /* || isAxeLower(id,
        controls[id].gamePad[GamePadThumbstick.HORIZONTAL_AXE_ID],
        -controls[id].gamePad[GamePadThumbstick.DEAD_ZONE] );*/
export const isRight = (id : number) => isKeyDown(controls[id].keyboard[Control.RIGHT])
    || isButtonDown(id, controls[id].gamePad[Control.RIGHT])
   /* || isAxeGreater(id,
        controls[id].gamePad[GamePadThumbstick.HORIZONTAL_AXE_ID],
        -controls[id].gamePad[GamePadThumbstick.DEAD_ZONE] );*/
export const isUp = (id : number) => isKeyDown(controls[id].keyboard[Control.UP])
    || isButtonDown(id, controls[id].gamePad[Control.UP])
   /* || isAxeLower(id,
        controls[id].gamePad[GamePadThumbstick.VERTICAL_AXE_ID],
        -controls[id].gamePad[GamePadThumbstick.DEAD_ZONE] );*/
export const isDown = (id : number) => isKeyDown(controls[id].keyboard[Control.DOWN])
    || isButtonDown(id, controls[id].gamePad[Control.DOWN])
   /* || isAxeGreater(id,
        controls[id].gamePad[GamePadThumbstick.VERTICAL_AXE_ID],
        -controls[id].gamePad[GamePadThumbstick.DEAD_ZONE] );*/

export const isForward = (id : number, direction : number) => direction === fighterDirection.RIGHT ? isRight(id) : isLeft(id);
export const isBackward = (id : number, direction : number) => direction === fighterDirection.LEFT ? isRight(id) : isLeft(id);

export const isIdle = (id : number) => !(isLeft(id) || isRight(id) || isUp(id) || isDown(id))
