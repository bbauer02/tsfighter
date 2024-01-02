const ken : HTMLImageElement = <HTMLImageElement>document.querySelector('img[alt="ken"]');

const position = {
    x:80,
    y:110
}

let velocity = 3;

export function updateKen(context: CanvasRenderingContext2D) {
    // Changement de position par frame
    position.x += velocity;
// Gestion de la collision avec les bords de la Frame
    if (position.x > context.canvas.width - ken.width|| position.x < 0) {
        velocity = -velocity
    }
}

export function drawKen(context: CanvasRenderingContext2D) {
    context.drawImage(ken, position.x,position.y)
}
