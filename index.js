/**
 * NexusSentry which reads from display, interprets content and sends to API
 */
const Sentry = require("./lib/sentry.js")
const sentry = new Sentry()

/**
 * Initialize monitor loop
 */
sentry.monitor()
//setTimeout(() => sentry.getUserStats("Tobiah"), 2500)
