const bot = require("../bot.js")
const screen = require("screen-info")
const Screen = require("../screen.js")


/**
 * Get User Stats from `/profile username`
 */
class UserStats {
    constructor(username) {
        this.username = username
    }


    /**
     * Open profile -> Parse each Tab -> Close Profile
     */
    get() {
        return new Promise((resolve, reject) => {
            this.openProfile()
                .catch(() => {
                    return new Promise((resolve, reject) => reject())
                    reject("User (" + this.username + ") doesn't exist.")
                })

                .then(() => this.getBaseInfo())
                .catch(() => {
                    return new Promise((resolve, reject) => reject())
                })

                .then(() => this.getEquipment())
                .catch(() => {
                    return new Promise((resolve, reject) => reject())
                })

                .then(() => this.getStats())
                .catch(() => {
                    return new Promise((resolve, reject) => reject())
                })

                .then(() => this.closeProfile())
                .catch(() => {
                    return new Promise((resolve, reject) => reject())
                })

                .then(() => {
                    resolve("success")
                })
                .catch(() => {
                    reject()
                })
        })
    }


    /**
     * Open user profile. Timeout may not be enough for low-end machines
     */
    openProfile() {
        return new Promise((resolve, reject) => {
            bot.send("/profile " + this.username)

            let size = screen.main()
            let anchorA = {
                x: 0,
                y: Math.round(size.height * 0.7)
            }
            let anchorB = {
                x: Math.round(size.width * 0.45),
                y: Math.round(size.height * 0.8)
            }
            let postOpen = new Screen(anchorA, anchorB)

            // Give profile 1s to open
            setTimeout(() => {
                postOpen.read().then(text => {

                    // Empty -> Profile is open (screen part is pure black)
                    text.length < 5 ? resolve() : reject()
                })
            }, 1000)
        })
    }


    /**
     * Close user profile. Timeout may not be enough for low-end machines
     */
    closeProfile() {
        return new Promise((resolve, reject) => {
            bot.native.keyTap("escape")
            bot.keyUp()

            // Give profile time to close
            setTimeout(() => {
                bot.native.keyTap("enter")
                bot.keyUp()
                setTimeout(resolve, 50)
            }, 200)
        })
    }


    /**
     * Get Data from Intro Screen
     */
    getBaseInfo() {
        return new Promise((resolve, reject) => {
            let size = screen.main()
            let anchorA = {
                x: Math.round(size.width * 0.67),
                y: Math.round(size.height * 0.167)
            }
            let anchorB = {
                x: Math.round(size.width * 0.93),
                y: Math.round(size.height * 0.833)
            }
            let intro = new Screen(anchorA, anchorB)
            intro.tessOptions.psm = 3 // tesseract --help-psm for details
            intro.tessOptions.config = "-c preserve_interword_spaces=1"
            intro.read().then(text => {
                //console.log(text)
                this.parseBaseInfo(text)
                resolve()
            })
        })
    }

    parseBaseInfo(text) {
        text.split(/\r?\n/).forEach(line => {
            // Non-Empty line always starts with character
            if (line[0] === undefined || line[0] === " ") return
        })
    }

    getEquipment() {

    }

    getStats() {

    }
}

module.exports = UserStats
