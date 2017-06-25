const robot = require("robotjs")

/**
 * Class for simulating hardware input
 */
class Bot {
    constructor() {
        this.native = robot
    }

    send(message) {
        robot.typeString(message + " ")
        robot.keyTap("enter")
        this.keyUp()
    }


    /**
     * Workaround for keyups not getting triggered
     */
    keyUp() {
        let pos = robot.getMousePos()
        robot.keyTap("tab", "alt")
        robot.keyTap("tab", "alt")
        robot.moveMouseSmooth(pos.x, pos.y)
        robot.mouseClick("left")
    }
}

module.exports = new Bot
