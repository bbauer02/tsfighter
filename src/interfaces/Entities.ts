import {Stage} from "../entities/Stage.ts";
import Fighter from "../entities/fighters/Fighter.ts";
import {FpsCounter} from "../entities/FpsCounter.ts";

type Entity = Stage | Fighter | FpsCounter;
export default Entity;