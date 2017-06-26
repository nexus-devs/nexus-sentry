/**
 * Queue for on_demand requests
 */
class Queue {
    constructor() {
        this.length = 0
    }

    add(fn) {
        this.length++
        this.promise = new Promise((resolve, reject) => {
            this.promise().then(data => {
                this.length--
                resolve(data)
            })
        })
        return this.promise
    }

    /**
     * Ensure connection is established, then fulfill request
     */
    sync(fn) {
        this.connecting ? this.connecting.then(fn) : fn()
    }
}
