import Fighter from "./Fighter.ts";

export class Ryu extends Fighter {
    constructor(x : number, y :number, velocity :number) {
        super('Ryu', x, y, velocity);
        this.image = <HTMLImageElement>document.querySelector('img[alt="ryu"]');
    }
}




