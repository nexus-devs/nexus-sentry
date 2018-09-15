const Request = require("./request.js")
const cache = require("../../cache.js")
const Screen = require("../../screen.js")
const screen = require("screen-info")
const Staging = require('cubic-client')


/**
 * Chat Sentry describing screen i/o handler
 */
class ChatSentry {

  constructor(client) {
    this.client = client
    this.staging = new Staging({
      api_url: 'https://api.staging.nexushub.co',
      auth_url: 'https://auth.staging.nexushub.co',
      user_key: process.env.NEXUS_SENTRY_STAGING_KEY,
      user_secret: process.env.NEXUS_SENTRY_STAGING_SECRET
    })

    // Get list of items
    this.items = {}
    this.client.get("/warframe/v1/items").then(res => {
      this.items = res || []
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
          if (res) {
            this.items = res
          }
        })
      }

      // Read screen, parse requests, send to API
      let size = screen.main()
      let anchorA = {
        x: 1,
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
            // Send raw message for live tradechat
            this.staging.post('/warframe/v1/orders/tradechat', {
              user: message.split(' ')[0].replace(/:/g, ''),
              message: message.split(' ').slice(1, message.split(' ').length).join(' '),
              createdAt: new Date()
            })

            // Parsed message for actual orders
            request.offers.forEach(offer => {
              if (!cache.find(offer)) {
                this.client.post("/warframe/v1/requests/new", offer)
                this.staging.post('/warframe/v1/orders', {
                  user: offer.user,
                  offer: offer.offer,
                  item: offer.item,
                  component: offer.component,
                  price: offer.price,
                  rank: offer.rank,
                  quantity: offer.count,
                  source: 'Trade Chat'
                })
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
