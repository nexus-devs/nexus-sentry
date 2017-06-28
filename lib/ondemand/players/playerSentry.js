const bot = require("../../bot.js")
const queue = require("../../queue.js")
const screen = require("screen-info")
const Screen = require("../../screen.js")
const Player = require("./player.js")


/**
 * Get User Stats from `/profile username`
 */
class PlayerSentry {
    constructor(client) {
        this.queue = queue
        this.client = client
    }


    /**
     * Get user stats
     */
    getPlayer(username) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.queue.run(() => {
                    return new Promise((resolve, reject) => {
                        // Give previous query enough time to finish
                        this.player = new Player(username)
                        this.get(username)
                            .then(data => {
                                resolve(data)
                            })
                            .catch(() => {
                                resolve({
                                    name: username
                                })
                            })
                    })
                }, username)

                // Send data back to sentry call
                .then(resolve)
            }, 2500)
        })
    }


    /**
     * Open profile -> Parse each Tab -> Close Profile
     */
    get(username) {
        return new Promise((resolve, reject) => {
            this.openProfile(username)
                .catch(() => {
                    return new Promise((resolve, reject) => reject())
                    reject("User (" + username + ") doesn't exist.")
                })

                // Get values from intro page
                .then(() => this.getBaseInfo())
                .catch(() => {
                    return new Promise((resolve, reject) => reject())
                })

                // Get equipment details
                .then(() => this.getEquipment())
                .catch(() => {
                    return new Promise((resolve, reject) => reject())
                })

                // Get statistics tab data
                .then(() => this.getDetailedStats())
                .catch(() => {
                    return new Promise((resolve, reject) => reject())
                })

                // ESC to close profile
                .then(() => this.closeProfile())
                .catch(() => {
                    this.closeProfile()
                    return new Promise((resolve, reject) => reject())
                })

                // Finish up
                .then(() => {
                    resolve(this.player)
                })
                .catch(() => {
                    reject()
                })
        })
    }


    /**
     * Open user profile. Timeout may not be enough for low-end machines
     */
    openProfile(username) {
        return new Promise((resolve, reject) => {
            bot.send("/profile " + username)

            let size = screen.main()
            let anchorA = {
                x: 0,
                y: Math.round(size.height * 0.5)
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
                    text.length < 10 ? resolve() : reject()
                })
            }, 2000)
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
            }, 300)
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
                y: Math.round(size.height * 0.96)
            }
            let intro = new Screen(anchorA, anchorB)
            intro.tessOptions.psm = 3 // tesseract --help-psm for details
            intro.read().then(text => {
                //console.log(text)
                this.player.parseBaseInfo(text)
                resolve()
            })
        })
    }

    getEquipment() {

    }

    getDetailedStats() {

    }
}

module.exports = PlayerSentry
