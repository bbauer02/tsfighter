import {FighterState} from "../constants/fighter.ts";

type FighterStateMetaData = {
    init: () => void; // Fonction d'initialisation de l'état
    update: () => void; // Fonction de mise à jour de l'état
    validFrom: FighterState[]; // Liste des états valides à partir desquels l'état peut passer à cet état
};

export default FighterStateMetaData;