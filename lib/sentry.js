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
        this.client = new Nexus()
        this.chatSentry = new ChatSentry(this.client)
        this.playerSentry = new PlayerSentry(this.client)
    }


    /**
     * Neverending screen monitoring
     */
    monitor() {
        this.chatSentry.readChat().then(() => this.monitor())
    }


    /**
     * Listeners for on-demand actions
     */
    listen() {
        this.client.subscribe("/warframe/v1/bots/getPlayerStats")
        this.client.on("/warframe/v1/bots/getPlayerStats", this.playerSentry.getPlayer)
    }
}

module.exports = NexusSentry
