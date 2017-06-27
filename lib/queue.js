/**
 * Queue for on_demand requests
 */
class Queue {
    constructor() {
        this.length = 0
        this.keywords = [] // avoid duplicates if keyword given
    }

    /**
     * Add function to promise chain
     * Keywords are meant to avoid double-executing the same function
     * Since the nexus API would listen to any "keyword" event, there's
     * no need to track which keyword belongs to which promise.
     */
    run(fn, keyword) {
        if (!keyword || !this.keywords.includes(keyword)) {
            this.keywords.push(keyword)

            // Not the first function in promise chain?
            if(this.length > 0) {
                this.promise = new Promise((resolve, reject) => {
                    this.promise.then(fn).then(data => {
                        this.keywords.splice(this.keywords.indexOf(keyword), 1)
                        this.length--
                        resolve(data)
                    })
                })
                return this.promise
            }
            else {
                this.promise = new Promise((resolve, reject) => {
                    fn().then(data => {
                        this.keywords.splice(this.keywords.indexOf(keyword), 1)
                        this.length--
                        resolve(data)
                    })
                })
            }
            this.length++
        }

        // Keyword already queued
        else {
            return new Promise((resolve, reject) => resolve())
        }
    }
}

module.exports = new Queue
