const Sentry = require("./lib/sentry.js")
const sentry = new Sentry()

 // Trade chat monitoring
 if (process.env.NEXUS_SENTRY_TASK === "monitor") {
     sentry.monitor()
 }

 // Interact with game as requested via api.nexus-stats.com
 else if (process.env.NEXUS_SENTRY_TASK === "listen") {
     sentry.listen()
 }

// Trigger user-stats fetcher directly
 else {
     sentry.playerSentry.getPlayer("MrBubbleSS") // Tobiah, Chungus, Zilork
 }
