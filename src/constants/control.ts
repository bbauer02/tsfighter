export enum Control {
    LEFT = 'left',
    RIGHT = 'right',
    UP = 'up',
    DOWN = 'down'
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
        },
        keyboard : {
            [Control.LEFT] : 'ArrowLeft',
            [Control.RIGHT] : 'ArrowRight',
            [Control.UP] : 'ArrowUp',
            [Control.DOWN] : 'ArrowDown',
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
        },
        keyboard : {
            [Control.LEFT] : 'KeyA',
            [Control.RIGHT] : 'KeyD',
            [Control.UP] : 'KeyW',
            [Control.DOWN] : 'KeyS',
        }
    }
]