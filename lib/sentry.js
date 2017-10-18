/**
 * Integrated Tesseract lib. Not working right now.
 * const NexusSentry = require('./build/Release/addon').NexusSentry;
 * const nexus = new NexusSentry;
 */
const Nexus = require("blitz-js-query")

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
      api_url: process.env.NEXUS_SENTRY_API || "https://api.nexus-stats.com",
      auth_url: process.env.NEXUS_SENTRY_AUTH || "https://auth.nexus-stats.com",
      user_key: process.env.NEXUS_SENTRY_USER_KEY,
      user_secret: process.env.NEXUS_SENTRY_USER_SECRET
    })
    this.chatSentry = new ChatSentry(this.client)
    this.playerSentry = new PlayerSentry(this.client)

    // Is the bot online / requires updates?
    this.online = true
    this.client.subscribe("/warframe/v1/game/updates")
    this.client.on("/warframe/v1/game/updates", () => this.online = false)
    this.upstatus()
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
    this.client.subscribe("/warframe/v1/bots/getProfile")
    this.client.on("/warframe/v1/bots/getProfile", (username) => {
      this.playerSentry.getPlayer(username)
        .then((profile) => {
          this.client.post("/warframe/v1/players/new", profile)
        })
    })
  }


  /**
   * Respond with bots upstatus on ping
   */
  upstatus() {
    this.client.subscribe("/warframe/v1/bots/ping")
    this.client.on("/warframe/v1/bots/ping", () => {
      let res = {}

      if (process.env.NEXUS_SENTRY_TASK === "monitor") {
        res = {
          name: "Chat-Sentry",
          online: this.online
        }
      }
      if (process.env.NEXUS_SENTRY_TASK === "listen") {
        res = {
          name: "Player-Sentry",
          online: this.online,
          queue: {
            length: this.playerSentry.queue.stack.length,
            timeRemaining: (this.playerSentry.queue.stack.length * 10 + 10) + "s"
          }
        }
      }
      this.client.post("/warframe/v1/bots/pong", res)
    })
  }
}

module.exports = NexusSentry
