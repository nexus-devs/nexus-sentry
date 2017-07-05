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
        robot.typeString(message)
        setTimeout(() => {
            robot.keyTap("enter")
            setTimeout(() => {
                this.keyUp()
            }, 100)
        }, 50)
    }


    /**
     * Workaround for keyups not getting triggered
     */
    keyUp() {
        let pos = robot.getMousePos()
        setTimeout(() => {
            robot.keyTap("tab", "alt")
            setTimeout(() => robot.keyTap("tab", "alt"), 100)
            setTimeout(() => {
                robot.moveMouseSmooth(pos.x, pos.y)
                robot.mouseClick("left")
            }, 100)
        }, 300)
    }
}

module.exports = new Bot
