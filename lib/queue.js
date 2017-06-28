/**
 * Queue for on_demand requests
 */
class Queue {
    constructor() {
        this.stack = []
        this.executing = null
    }

    /**
     * Add function to stack and execute
     */
    run(fn, keyword) {
        return new Promise((resolve, reject) => {
            console.log("enqueueing " + keyword)

            // Let function remove itself from stack after finishing
            // Also run next function once done
            let fnMod = () => {
                fn().then(data => {
                    this.stack.shift()
                    if (this.stack[0]) {
                        this.executing = true
                        this.stack[0].fn()
                    } else {
                        this.executing = false
                    }
                    resolve(data)
                })
            }

            // Push function to stack. Will run automatically once others are done.
            this.add({
                fn: fnMod,
                keyword: keyword
            })

            // Nothing running? Ensure to trigger the waterfall.
            if (!this.executing) {
                this.executing = true
                this.stack[0].fn()
            }
        })
    }


    /**
     * Add function to stack
     * Keywords are meant to avoid double-executing the same function
     * Since the nexus API would listen to any "keyword" event, there's
     * no need to track which keyword belongs to which promise.
     */
    add(obj) {
        for (let queued of this.stack) {
            if (queued.keyword === obj.keyword) {
                return
            }
        }
        this.stack.push(obj)
    }
}

module.exports = new Queue
