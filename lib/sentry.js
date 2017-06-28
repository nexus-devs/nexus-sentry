/**
 * Integrated Tesseract lib. Not working right now.
 * const NexusSentry = require('./build/Release/addon').NexusSentry;
 * const nexus = new NexusSentry;
 */
const Nexus = require("nexus-stats-api")

/**
 * Load Commands
 */
const ChatSentry = require("./tasks/trade/chatSentry.js")
const PlayerSentry = require("./ondemand/players/playerSentry.js")


/**
 * NexusSentry which reads from display, interprets content and sends to API
 */
class NexusSentry {

    /**
     * Connect to to api.nexus-stats.com
     */
    constructor() {
        this.client = new Nexus({
            api_url: "http://localhost:3010",
            auth_url: "http://localhost:3030",
            user_key: "Vf9W14UqTOceb6p6hTarH9LCbJCIKpY1PLUFHFj68cpWnLM91S2pzELKUc8bGn9I",
            user_secret: "wSIKrCEldMIeKi7W6Q0ITHSAudnzXWYUEAEFe1HmZEbPcyjnW4VNjjuwxpmAB05C"
        })
        this.chatSentry = new ChatSentry(this.client)
        this.playerSentry = new PlayerSentry(this.client)
    }



    /**
     * Neverending screen monitoring
     */
    monitor() {
        this.chatSentry.readChat().then(() => this.monitor())

        // Return requests in queue and predict ETA
        this.client.subscribe("/warframe/v1/bots/ping")
        this.client.on("/warframe/v1/bots/ping", () => {
            this.client.post("/warframe/v1/bots/pong", {
                name: "Player-Sentry",
                status: "online",
                queue: {
                    length: this.playerSentry.queue.stack.length,
                    timeRemaining: (this.playerSentry.queue.stack.length * 15 + 15) + "s"
                }
            })
        })
    }


    /**
     * Listeners for on-demand actions
     */
    listen() {

        // Get Profiles
        this.client.subscribe("/warframe/v1/bots/getProfile")
        this.client.on("/warframe/v1/bots/getProfile", (username) => {
            this.playerSentry.getPlayer(username)
                .then((profile) => {
                    this.client.post("/warframe/v1/players/new", profile)
                })
        })

        // Return requests in queue and predict ETA
        this.client.subscribe("/warframe/v1/bots/ping")
        this.client.on("/warframe/v1/bots/ping", () => {
            this.client.post("/warframe/v1/bots/pong", {
                name: "Player-Sentry",
                status: "online",
                queue: {
                    length: this.playerSentry.queue.stack.length,
                    timeRemaining: (this.playerSentry.queue.stack.length * 10 + 10) + "s"
                }
            })
        })
    }
}

module.exports = NexusSentry
