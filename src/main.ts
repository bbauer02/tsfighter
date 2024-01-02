import './style.css'
import { GameViewport } from './interfaces';

const gameViewport : GameViewport = {
    WIDTH: 384,
    HEIGHT: 224
}


const canvas :HTMLCanvasElement = <HTMLCanvasElement>document.querySelector('canvas');
const context: CanvasRenderingContext2D = <CanvasRenderingContext2D>canvas.getContext('2d');

canvas.width = gameViewport.WIDTH;
canvas.height = gameViewport.HEIGHT;

// Chargement de l'image de KEN
const [ken, background] = document.querySelectorAll('img');

const position = {
    x:gameViewport.WIDTH / 2 - ken.width / 2,
    y:110
}

let velocity = 3;




function animate () {

    // Changement de position par frame
    position.x += velocity;
    // Gestion de la collision avec les bords de la Frame
    if (position.x > gameViewport.WIDTH - ken.width|| position.x < 0) {
        velocity = -velocity
    }
    // Fonction de nettoyage des frames précédentes
    context.clearRect(0,0, gameViewport.WIDTH, gameViewport.HEIGHT)

    // Ajout du BackGround
    context.drawImage(background,0,0)

    context.drawImage(ken, position.x,position.y)

    requestAnimationFrame(animate);
}

animate();