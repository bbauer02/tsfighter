import {Stage} from "../entities/Stage.ts";
import Fighter from "../entities/fighters/Fighter.ts";
import {FpsCounter} from "../entities/FpsCounter.ts";
import {Shadow} from "../entities/fighters/shadow.ts";
import {StatusBar} from "../entities/overlays/StatusBar.ts";

type Entity = Stage | Fighter | FpsCounter | Shadow | StatusBar ;
export default Entity;