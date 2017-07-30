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

          // Alt+Tab out of window and back to "release" enter button
            robot.keyToggle("alt", "down")
            robot.keyToggle("tab", "down")
            setTimeout(() => {
              robot.keyToggle("tab", "up")
              robot.keyToggle("alt", "up")

              // Back in
              robot.keyToggle("alt", "down")
              robot.keyToggle("tab", "down")
              setTimeout(() => {
                robot.keyToggle("tab", "up")
                robot.keyToggle("alt", "up")
            }, 75)
        }, 75)

            // Click into window for focus
            setTimeout(() => {
                robot.moveMouseSmooth(pos.x, pos.y)
                robot.mouseClick("left")
            }, 200)
        }, 200)
    }
}

module.exports = new Bot
