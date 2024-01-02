const background:HTMLImageElement = <HTMLImageElement>document.querySelector('img[alt="stage"]');

export function drawBackground(context: CanvasRenderingContext2D) {
    context.drawImage(background, 0,0)
}