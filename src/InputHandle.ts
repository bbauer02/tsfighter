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

