import {FighterState} from '../constants/fighter.ts';


type FighterAnimations  = {
    [fighterState in FighterState]: Array<[string, number]>;
};
export default FighterAnimations;