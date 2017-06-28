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
            this.keyUp()
        }, 50)
    }


    /**
     * Workaround for keyups not getting triggered
     */
    keyUp() {
        //let pos = robot.getMousePos()
        //setTimeout(() => {
        //    robot.keyTap("tab", "alt")
        //    robot.keyTap("tab", "alt")
        //    setTimeout(() => {
        //        robot.moveMouseSmooth(pos.x, pos.y)
        //        robot.mouseClick("left")
        //    }, 200)
        //}, 200)
    }
}

module.exports = new Bot
