import { FighterDirection } from '../interfaces';
export const fighterDirection : FighterDirection    = {
    LEFT: -1,
    RIGHT: 1
};

export enum FighterState {
    IDLE = 'idle',
    WALK_FORWARD= 'walkForwards',
    WALK_BACKWARD= 'walkBackwards',
    JUMP_UP= 'jump-up',
    JUMP_FORWARD =  'jumpForwards',
    JUMP_BACKWARD =  'jumpBackwards',
    CROUCH = 'crouch',
    CROUCH_DOWN = 'crouchDown',
    CROUCH_UP = 'crouchUp'
}
