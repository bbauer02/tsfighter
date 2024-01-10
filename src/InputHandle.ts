import {Control, controls} from "./constants/control.ts";
import {fighterDirection} from "./constants/fighter.ts";

const heldKeys : Set<string> = new Set();
const gamePads = new Map();
const pressedButtons = new Set();

const mappedKeys = controls.map(({keyboard}) => Object.values(keyboard) ).flat();
const pressedKeys = new Set();
function handleKeyDown(event : KeyboardEvent) : void {

    if(!mappedKeys.includes(event.code)) return;

    event.preventDefault();

    heldKeys.add(event.code);
}


function handleKeyUp(event : KeyboardEvent) :void {

    if(!mappedKeys.includes(event.code)) return;

    event.preventDefault();

    heldKeys.delete(event.code);
    pressedKeys.delete(event.code);
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

            for(const button in buttons) {
                const key = `${gamePad.index}-${button}`;
                if(pressedButtons.has(key) && isButtonUp(gamePad.index, button)) {
                    pressedButtons.delete(key)
                }
            }
        }
    }
}


export const isKeyDown  = (code:string) : boolean => heldKeys.has(code);
export const isKeyUp  = (code:string) : boolean => !heldKeys.has(code);
export function isKeyPressed(code : string) {
    if(heldKeys.has(code) && !pressedKeys.has(code)) {
        pressedKeys.add(code);
        return true;
    }
    return false;
}
export const isButtonDown = (padId :number , button:number) => {
    return gamePads.get(padId)?.buttons[button].pressed
};
export const isButtonUp = (padId :number, button :number) => !gamePads.get(padId)?.buttons[button].pressed;


export function isButtonPressed(padId : number, button : number) {
    const key = `${padId}-${button}`;

    if(isButtonDown(padId, button) && !pressedButtons.has(key)) {
        pressedButtons.add(key);
        return true;
    }
}
export const isAxeGreater = (padId:number, axeId:number, value:number) => gamePads.get(padId)?.axes[axeId] >= value;
export const isAxeLower = (padId:number, axeId:number, value:number) => gamePads.get(padId)?.axes[axeId] <= value;

export const isControlDown = (id : number, control: Control) => isKeyDown(controls[id].keyboard[control])
|| isButtonDown(id, controls[id].gamePad[control]);

export const isControlPressed = (id: number, control  : Control) => isKeyPressed(controls[id].keyboard[control])
    || isButtonPressed(id, controls[id].gamePad[control]);
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

export const isIdle = (id : number) => !(isLeft(id) || isRight(id) || isUp(id) || isDown(id));

export const isLightPunch = (id: number) => isControlPressed(id, Control.LIGHT_PUNCH);
export const isMediumPunch = (id: number) => isControlPressed(id, Control.MEDIUM_PUNCH);
export const isHeavyPunch = (id: number) => isControlPressed(id, Control.HEAVY_PUNCH);

export const isLightKick = (id: number) => isControlPressed(id, Control.LIGHT_KICK);
export const isMediumKick = (id: number) => isControlPressed(id, Control.MEDIUM_KICK);
export const isHeavyKick = (id: number) => isControlPressed(id, Control.HEAVY_KICK);