/**
 * Integrated Tesseract lib. Not working right now.
 * const NexusSentry = require('./build/Release/addon').NexusSentry;
 * const nexus = new NexusSentry;
 */
const screen = require("./screen.js")
const Request = require("./request.js")
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
        this.client = new Nexus({
            api_url: "http://localhost:3010",
            auth_url: "http://localhost:3030",
            user_key: "Vf9W14UqTOceb6p6hTarH9LCbJCIKpY1PLUFHFj68cpWnLM91S2pzELKUc8bGn9I",
            user_secret: "wSIKrCEldMIeKi7W6Q0ITHSAudnzXWYUEAEFe1HmZEbPcyjnW4VNjjuwxpmAB05C",
            ignore_limiter: true
        })

        // Get list of items
        this.items = {}
        this.client.get("/warframe/v1/items").then(res => {
            this.items = JSON.parse(res.body)
            //let request = new Request("GABEN: WTS [Cernos Prime] Upper Limb 50p, Lower Limb 30p, 3x String for 20, Sancti Tigris x 2 50p, Tigris Prime Barrel 50p 3x Argon Scope R5", this.items)
            //console.log(request.offers)
        })

        // Time before item list gets refreshed
        this.cacheDuration = 60000
        this.cacheTimer = new Date
    }


    /**
     * Neverending screen monitoring
     */
    monitor() {
        this.process().then(this.monitor)
    }


    /**
     * Read, Interpret, Send
     */
    process() {
        return new Promise((resolve, reject) => {

            // Sync item cache every minute
            if (new Date - this.cacheTimer > this.cacheDuration) {
                this.cacheTimer = new Date
                this.client.get("/warframe/v1/items").then(res => {
                    this.items = res.body
                })
            }

            // Read screen, parse requests, send to API
            screen.read().then(content => {

                content.split(/\r?\n/).forEach(message => {

                    // Non-Empty line always starts with character
                    if(message[0] === undefined || message[0] === " ") return

                    // Have message interpreted into usable request
                    let request = new Request(message, this.items)

                    // Request contains all offers in single request
                    request.offers.forEach(offer => {
                        this.client.post("/warframe/v1/requests/new", offer)
                    })
                 })
                resolve() // all messages processed
            })
        })
    }
}

module.exports = NexusSentry
