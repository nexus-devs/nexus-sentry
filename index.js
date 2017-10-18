const Sentry = require("./lib/sentry.js")
const sentry = new Sentry()

process.on('unhandledRejection', err => {
  console.log(err)
})
process.on('uncaughtException', err => {
  console.log(err)
})

// Trade chat monitoring
if (process.env.NEXUS_SENTRY_TASK === "monitor") {
  sentry.monitor()
}

// Interact with game as requested via api.nexus-stats.com
else if (process.env.NEXUS_SENTRY_TASK === "listen") {
  sentry.listen()
}
