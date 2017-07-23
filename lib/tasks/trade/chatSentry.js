const Request = require("./request.js")
const cache = require("../../cache.js")
const Screen = require("../../screen.js")
const screen = require("screen-info")


/**
 * Chat Sentry describing screen i/o handler
 */
class ChatSentry {

    constructor(client) {
        this.client = client

        // Get list of items
        this.items = {}
        this.client.get("/warframe/v1/items").then(res => {
            this.items = JSON.parse(res.body)
        })

        // Time before item list gets refreshed
        this.cacheDuration = 60000
        this.cacheTimer = new Date
    }

    /**
     * Read, Interpret, Send
     */
    readChat() {
        return new Promise((resolve, reject) => {

            // Sync item cache every minute
            if (new Date - this.cacheTimer > this.cacheDuration) {
                this.cacheTimer = new Date
                this.client.get("/warframe/v1/items").then(res => {
                    this.items = JSON.parse(res.body)
                })
            }

            // Read screen, parse requests, send to API
            let size = screen.main()
            let anchorA = {
                x: Math.round(size.width * 0.005),
                y: 0
            }
            const chatArea = new Screen(anchorA)
            chatArea.read().then(content => {
                content.split(/\r?\n/).forEach(message => {

                    // Non-Empty line always starts with character
                    if (message[0] === undefined || message[0] === " ") return

                    // Request parsing
                    let request = new Request(message, this.items)
                    if (request.offers) {
                        request.offers.forEach(offer => {
                            if (!cache.find(offer)) {
                                this.client.post("/warframe/v1/requests/new", offer)
                                cache.add(offer)
                            }
                        })
                    }
                })
                resolve() // all messages processed
            })
        })
    }
}

module.exports = ChatSentry
