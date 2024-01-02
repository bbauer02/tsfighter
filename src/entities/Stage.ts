export class Stage {
    private image: HTMLImageElement;

    constructor() {
        this.image = <HTMLImageElement>document.querySelector('img[alt="stage"]');
    }

    draw(context: CanvasRenderingContext2D) {
        context.drawImage(this.image, 0, 0);
    }

    update() {
        // nothing to do
    }

}

