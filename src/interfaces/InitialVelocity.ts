import {FighterState} from "../constants/fighter.ts";

interface InitialVelocity {
    jump: number;
    x : {
        [FighterState.WALK_FORWARD]: number ,
        [FighterState.WALK_BACKWARD] : number,
        [FighterState.JUMP_FORWARD] : number,
        [FighterState.JUMP_BACKWARD] : number
    };
}

export default InitialVelocity;

