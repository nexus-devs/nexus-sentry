/**
 * Integrated Tesseract lib. Not working right now.
 * const NexusSentry = require('./build/Release/addon').NexusSentry;
 * const nexus = new NexusSentry;
 */
const screen = require("./screen.js")
//const Request = require("./request.js")
const Nexus = require("nexus-stats-api")


/**
 * NexusSentry which reads from display, interprets content and sends to API
 */
class NexusSentry {

    /**
     * Connecto to api.nexus-stats.com, get item list
     */
    constructor() {
        this.client = new Nexus({
            api_url: "https://api.nexus-stats.com",
            auth_url: "https://auth.nexus-stats.com/",
            user_key: "SNaLXJnb72Iup5keccWpR6Llxehujjwd5cfRJtSOCprd4KsAOEuE9WoXsNynfS9j",
            user_secret: "ZoPP1ZgicPRMOOx8mVHlicCIEtkfaBnBvdaX9lqnowJfvT2pJE9l8Bz9AfjmHQhV",
            ignore_limiter: true
        })
        this.client.get("/warframe/v1/items").then(res => {
            this.items = res.body
        })

        this.cacheDuration = 60000
        this.cacheTimer = new Date
    }


    /**
     * Neverending screen monitoring
     */
    monitor() {
        this.scan().then(this.monitor)
    }


    /**
     * Read, Interpret, Send
     */
    process() {
        return new Promise((resolve, reject) => {

            // Sync item cache every minute
            if (new Date - this.cacheTimer > this.cacheDuration) {
                this.cacheTimer = new Date
                nexus.get("/warframe/v1/items").then(res => {
                    items = res.body
                })
            }

            // Read screen, parse requests, send to API
            screen.read().then(content => {

                content.split(/\r?\n/).forEach(message => {

                    // Non-Empty line always starts with character
                    if(message[0] === undefined || message[0] === " ") return
                    console.log("message: " + message)

                    // Have message interpreted into usable request
                    //let request = new Request(message, items)

                    // Request contains all offers in single request
                    //request.forEach(offer => {
                    //    nexus.post("/warframe/v1/requests/new", offer)
                    //})
                })
                resolve() // all messages processed
            })
        })
    }
}

module.exports = NexusSentry
