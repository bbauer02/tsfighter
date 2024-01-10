export function rectsOverlap(x1 : number, y1: number, width1: number, height1: number, x2: number, y2: number, width2: number, height2: number) : boolean {
    return (
        x1 < x2 + width2 &&
        x1 + width1 > x2 &&
        y1 < y2 + height2 &&
        y1 + height1 > y2
    );
}


export function boxOverlap(box1, box2) {
    return rectsOverlap(box1.x, box1.y, box1.width, box1.height, box2.x, box2.y, box2.width, box2.height);
}

export function getActualBoxDimentions(position, direction, box) {

    const x1 = position.x + (box.x * direction);
    const x2 = x1 + (box.width * direction);

    return {
        x: Math.min(x1, x2),
        y: position.y + box.y,
        width: box.width,
        height: box.height
    }


}