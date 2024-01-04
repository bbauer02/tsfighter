import './style.css'
import { StreetFighterGame} from "./StreetFighterGame.ts";
import { FighterState} from "./constants/fighter.ts";

function populateMoveDropdown() :void {
    const dropdown :HTMLElement = <HTMLElement>document.getElementById('state-dropdown');
    Object.entries(FighterState).forEach(([, value ]) => {
        const option :HTMLOptionElement = document.createElement('option');
        option.setAttribute('value', value);
        option.innerText = value;
        dropdown.appendChild(option);
    });
}



populateMoveDropdown();
new StreetFighterGame().start();








