import {HEALTH_MAX_HIT_POINTS} from "../constants/battle.ts";

export const createDefaultFighterState = (id) => ({
    id,
    score:1,
    battles:0,
    hitPoints: HEALTH_MAX_HIT_POINTS
})