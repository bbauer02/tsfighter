import { FighterDirection } from '../interfaces';
import {FRAME_TIME} from "./game.ts";



export const fighterDirection : FighterDirection    = {
    LEFT: -1,
    RIGHT: 1
};

export const FighterAttackType = {
    PUNK: 'punch',
    KICK: 'kick'
}
export const FighterId = {
    RYU: "Ryu",
    KEN: "Ken",
};

export const FighterAttackStrength = {
    LIGHT : 'light',
    MEDIUM : 'medium',
    HEAVY : 'heavy'
}

export const FighterAttackBaseData = {
    [FighterAttackStrength.LIGHT]: {
        score: 100,
        damage: 12,
        slide: {
            velocity: -12 * FRAME_TIME,
            friction: 600,
        },
    },
    [FighterAttackStrength.MEDIUM]: {
        score: 300,
        damage: 20,
        slide: {
            velocity: -16 * FRAME_TIME,
            friction: 600,
        },
    },
    [FighterAttackStrength.HEAVY]: {
        score: 500,
        damage: 28,
        slide: {
            velocity: -22 * FRAME_TIME,
            friction: 800,
        },
    },
};

export enum FighterState {
    IDLE            = 'idle',
    WALK_FORWARD    = 'walkForwards',
    WALK_BACKWARD   = 'walkBackwards',
    JUMP_START      = 'jumpStart',
    JUMP_UP         = 'jump-up',
    JUMP_FORWARD    =  'jumpForwards',
    JUMP_BACKWARD   =  'jumpBackwards',
    JUMP_LAND       = 'jumpLand',
    CROUCH          = 'crouch',
    CROUCH_DOWN     = 'crouchDown',
    CROUCH_UP       = 'crouchUp',
    IDLE_TURN       = 'idleTurn',
    CROUCH_TURN     = 'crouchTurn',
    LIGHT_PUNCH     = "lightPunch",
    MEDIUM_PUNCH    = "mediumPunch",
    HEAVY_PUNCH     = "heavyPunch",
    LIGHT_KICK      = "lightKick",
    MEDIUM_KICK     = "mediumKick",
    HEAVY_KICK      = "heavyKick",
}

export const PushBox   = {
    IDLE : [-16,-80,32,78],
    JUMP : [-16,-91,32,66],
    BEND : [-16,-91,32,66],
    CROUCH : [-16,-50,32,50],
}

export const HurtBox = {
    IDLE: [
        [-8, -88, 24, 16],
        [-26, -74, 40, 42],
        [-26, -31, 40, 32],
    ],
    BACKWARD: [
        [-19, -88, 24, 16],
        [-26, -74, 40, 42],
        [-26, -31, 40, 32],
    ],
    FORWARD: [
        [-3, -88, 24, 16],
        [-26, -74, 40, 42],
        [-26, -31, 40, 32],
    ],
    JUMP: [
        [-13, -106, 28, 18],
        [-26, -90, 40, 42],
        [-22, -66, 38, 18],
    ],
    BEND: [
        [-2, -68, 24, 18],
        [-16, -53, 44, 24],
        [-16, -24, 44, 24],
    ],
    CROUCH: [
        [6, -61, 24, 18],
        [-16, -46, 44, 24],
        [-16, -24, 44, 24],
    ],
    PUNCH: [
        [11, -94, 24, 18],
        [-7, -77, 40, 43],
        [-7, -33, 40, 33],
    ],
};


export const FrameDelay = {
    FREEZE:0,
    TRANSITION: -1
}

export const PUSH_FRICTION = 66;
export const FIGHTER_START_DISTANCE = 88;