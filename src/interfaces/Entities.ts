import {Stage} from "../entities/Stage.ts";
import Fighter from "../entities/fighters/Fighter.ts";
import {FpsCounter} from "../entities/FpsCounter.ts";
import {Shadow} from "../entities/fighters/shadow.ts";

type Entity = Stage | Fighter | FpsCounter | Shadow;
export default Entity;