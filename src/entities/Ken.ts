import Fighter from "./Fighter.ts";

export class Ken extends Fighter {
    constructor(x : number, y :number, velocity :number) {
        super('Ken', x, y, velocity);
        this.image = <HTMLImageElement>document.querySelector('img[alt="ken"]');
    }
}




