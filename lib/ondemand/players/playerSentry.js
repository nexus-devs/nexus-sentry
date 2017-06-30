const bot = require("../../bot.js")
const queue = require("../../queue.js")
const screen = require("screen-info")
const Screen = require("../../screen.js")
const Player = require("./player.js")
const fuzzy = require("string_score")


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
                }, username.toLowerCase())

                // Send data back to sentry call
                .then(resolve)
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
                x: Math.round(size.width * 0.33),
                y: 0
            }
            let anchorB = {
                x: Math.round(size.width * 0.66),
                y: Math.round(size.height * 0.12)
            }
            let postOpen = new Screen(anchorA, anchorB)
            postOpen.tessOptions.psm = 3

            // Give profile enough time to open
            setTimeout(() => {
                postOpen.read().then(text => {
                    let lines = text.split(/\r?\n/)
                    lines.forEach((line, index) => {
                        console.log("comparing: " + line + " & " + username + " -> " + line.toLowerCase().score(username.toLowerCase()))
                        if (line.toLowerCase() === (username.toLowerCase())) {
                            this.player.name = lines[index]
                            return resolve()
                        }
                        else if (line.toLowerCase().score(username.toLowerCase()) > 0.6) {
                            this.player.name = username
                            return resolve()
                        }
                        else {
                            index === (lines.length - 1) ? reject() : null
                        }
                    })
                })
            }, 2000)
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
                y: Math.round(size.height * 0.1)
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
