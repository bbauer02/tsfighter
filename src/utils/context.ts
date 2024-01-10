export function drawFrame(context:CanvasRenderingContext2D, image : HTMLImageElement,dimensions , x : number, y :number, direction = 1 ) {
    const [sourceX, sourceY, sourceWidth, sourceHeight] = dimensions ;

    context.scale(direction, 1);
    context.drawImage(
        image,
        sourceX, sourceY, sourceWidth, sourceHeight,
        x * direction, y, sourceWidth, sourceHeight,
    );
    context.setTransform(1,0,0,1,0,0);

}

export function getContext() :CanvasRenderingContext2D {
    const canvas :HTMLCanvasElement = <HTMLCanvasElement>document.querySelector('canvas');
    const context :CanvasRenderingContext2D = <CanvasRenderingContext2D>canvas.getContext('2d');
    context.imageSmoothingEnabled = false;
    return context
}