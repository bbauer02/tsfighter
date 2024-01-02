const ryu : HTMLImageElement = <HTMLImageElement>document.querySelector('img[alt="ryu"]');

const position = {
    x:80,
    y:110
}

let velocity = -1;

export function updateRyu(context: CanvasRenderingContext2D) {
    // Changement de position par frame
    position.x += velocity;
// Gestion de la collision avec les bords de la Frame
    if (position.x > context.canvas.width - ryu.width|| position.x < 0) {
        velocity = -velocity
    }
}

export function drawRyu(context: CanvasRenderingContext2D) {
    context.drawImage(ryu, position.x,position.y)
}
