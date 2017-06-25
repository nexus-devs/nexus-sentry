/**
 * Integrated Tesseract lib. Not working right now.
 * const NexusSentry = require('./build/Release/addon').NexusSentry;
 * const nexus = new NexusSentry;
 */
const Screen = require("./screen.js")
const screen = new Screen
const bot = require("./bot.js")
const cache = require("./cache.js")
const UserStats = require("./ondemand/userStats.js")
const Request = require("./tasks/request.js")
const Nexus = require("nexus-stats-api")


/**
 * NexusSentry which reads from display, interprets content and sends to API
 */
class NexusSentry {

    /**
     * Connecto to api.nexus-stats.com, get item list
     */
    constructor() {

        // Connect to api.nexus-stats.com
        this.client = new Nexus()

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
     * Neverending screen monitoring
     */
    monitor() {
        this.readChat().then(() => this.monitor())
    }


    /**
     * Listeners for on-demand actions
     */
    listen() {
        this.client.subscribe("/warframe/v1/bots/getUserStats")
        this.client.on("/warframe/v1/bots/getUserStats", this.getUserStats)
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
            screen.read().then(content => {
                content.split(/\r?\n/).forEach(message => {

                    // Non-Empty line always starts with character
                    if (message[0] === undefined || message[0] === " ") return

                    // Request parsing
                    let request = new Request(message, this.items)
                    if (request.offers) {
                        request.offers.forEach(offer => {
                            if (!cache.find(offer)) {
                                this.client.post("/warframe/test/requests/new", offer)
                                cache.add(offer)
                            }
                        })
                    }
                })
                resolve() // all messages processed
            })
        })
    }


    /**
     * Get user stats
     */
    getUserStats(username) {
        console.log("Opening profile in 2500ms. Ensure that the ingame chat is focused!")
        let stats = new UserStats(username)
        stats.get().then(console.log)
                   .catch(() => console.log("meh"))
    }
}

module.exports = NexusSentry
