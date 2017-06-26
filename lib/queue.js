/**
 * Queue for on_demand requests
 */
class Queue {
    constructor() {
        this.length = 0
    }

    run(fn) {
        if(this.length > 0) {
            this.promise = new Promise((resolve, reject) => {
                this.promise.then(fn).then(data => {
                    this.length--
                    resolve(data)
                })
            })
            return this.promise
        }
        else {
            this.promise = new Promise((resolve, reject) => {
                fn().then(data => {
                    this.length--
                    resolve(data)
                })
            })
        }
        this.length++
    }
}

module.exports = new Queue
