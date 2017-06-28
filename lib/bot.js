const robot = require("robotjs")
const clipboard = require("copy-paste")

/**
 * Class for simulating hardware input
 */
class Bot {
    constructor() {
        this.native = robot
    }

    send(message) {
        clipboard.copy(message)
        setTimeout(() => {
            robot.keyTap("v", "control")
            robot.keyTap("enter")
            this.keyUp()
        }, 50)
    }


    /**
     * Workaround for keyups not getting triggered
     */
    keyUp() {
        let pos = robot.getMousePos()
        robot.keyTap("tab", "alt")
        robot.keyTap("tab", "alt")
        setTimeout(() => {
            robot.moveMouseSmooth(pos.x, pos.y)
            robot.mouseClick("left")
        }, 100)
    }
}

module.exports = new Bot
