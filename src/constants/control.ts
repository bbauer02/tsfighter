export enum Control {
    LEFT = 'left',
    RIGHT = 'right',
    UP = 'up',
    DOWN = 'down',
    LIGHT_PUNCH     = "lightPunch",
    MEDIUM_PUNCH    = "mediumPunch",
    HEAVY_PUNCH     = "heavyPunch",
    LIGHT_KICK      = "lightKick",
    MEDIUM_KICK     = "mediumKick",
    HEAVY_KICK      = "heavyKick",
}

export const GamePadThumbstick = {
    DEAD_ZONE : 'deadZone',
    HORIZONTAL_AXE_ID: 'horizontalAxeId',
    VERTICAL_AXE_ID: 'verticalAxeId'
}
export const controls  = [
    {
        gamePad : {
            [GamePadThumbstick.DEAD_ZONE] :0.12,
            [GamePadThumbstick.HORIZONTAL_AXE_ID] : 0,
            [GamePadThumbstick.VERTICAL_AXE_ID] : 1,


            [Control.LEFT] : 14,
            [Control.RIGHT] : 15,
            [Control.UP] : 12,
            [Control.DOWN] : 13,
            [Control.LIGHT_PUNCH]:0,
            [Control.MEDIUM_PUNCH]: 3,
            [Control.HEAVY_PUNCH]: 5,
            [Control.LIGHT_KICK]: 0,
            [Control.MEDIUM_KICK]: 1,
            [Control.HEAVY_KICK]: 4,

        },
        keyboard : {
            [Control.LEFT] : 'ArrowLeft',
            [Control.RIGHT] : 'ArrowRight',
            [Control.UP] : 'ArrowUp',
            [Control.DOWN] : 'ArrowDown',
            [Control.LIGHT_PUNCH]: "ControlRight",
            [Control.MEDIUM_PUNCH]: "KeyK",
            [Control.HEAVY_PUNCH]: "KeyL",
            [Control.LIGHT_KICK]: "KeyN",
            [Control.MEDIUM_KICK]: "KeyM",
            [Control.HEAVY_KICK]: "Comma",
        }
    },
    {
        gamePad : {
            [GamePadThumbstick.DEAD_ZONE] : 0.5,
            [GamePadThumbstick.HORIZONTAL_AXE_ID] : 0,
            [GamePadThumbstick.VERTICAL_AXE_ID] : 1,

            [Control.LEFT] : 14,
            [Control.RIGHT] : 15,
            [Control.UP] : 12,
            [Control.DOWN] : 13,
            [Control.LIGHT_PUNCH]: 0,
            [Control.MEDIUM_PUNCH]: 3,
            [Control.HEAVY_PUNCH]: 5,
            [Control.LIGHT_KICK]: 0,
            [Control.MEDIUM_KICK]: 1,
            [Control.HEAVY_KICK]: 4,
        },
        keyboard : {
            [Control.LEFT] : 'KeyA',
            [Control.RIGHT] : 'KeyD',
            [Control.UP] : 'KeyW',
            [Control.DOWN] : 'KeyS',
            [Control.LIGHT_PUNCH]: "KeyF",
            [Control.MEDIUM_PUNCH]: "KeyG",
            [Control.HEAVY_PUNCH]: "KeyC",
            [Control.LIGHT_KICK]: "KeyN",
            [Control.MEDIUM_KICK]: "KeyE",
            [Control.HEAVY_KICK]: "KeyR",
        }
    }
]