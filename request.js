class Request {

    /**
     * Something something
     */
    constructor(message, items) {
        this.message = message.split(" ")
        this.items = items
        this.partitions = []
        this.interpret()
    }


    /**
     * Transforms given message into array of offers
     */
    interpret() {

        // Get markers where new item starts
        this.getMarkers()

        // Interpret the resulting partitions individually
        //this.getOffers()
    }


    /**
     * Match each word against item list and set partitions
     */
    getMarkers() {
        let partitions = []

        // Detect partition indices
        for (let i = 0; i < this.message.length; i++) {
            let item = this.matchItem(i)
            if (item) {
                partitions.push({
                    item: item,
                    index: i
                })
                i += item.length - 1
            }
        }

        // Create partitions
        let lastIndex = 0
        for (let i = 1; i <= partitions.length; i++) {

            // Always create message of previous partition until current
            if (i !== partitions.length) {
                partitions[i - 1].message = this.message.slice(lastIndex, partitions[i].index)
                lastIndex = partitions[i].index
            }

            // End of last partition is end of message
            else {
                partitions[i - 1].message = this.message.slice(lastIndex, this.message.length)
            }
        }
        console.log(partitions)
        console.log(" ")
    }


    /**
     * Check if item contained in item list
     */
    matchItem(i) {
        let matched = undefined
        for (let j = 0; j < this.items.length; j++) {
            let item = this.items[j].name.split(" ")

            // Item contained in message? Match further words
            for (let k = 0; k < item.length; k++) {

                // Words match until end? Item found
                if (this.message[i + k] && this.message[i + k].toLowerCase().includes(item[k].toLowerCase())) {
                    matched = k === item.length - 1 ? item : undefined
                }

                // Words only match partially? Wrong item
                else {
                    break
                }
            }

            // Item found? Don't query rest of list
            if (matched) break
        }
        return matched
    }
}

module.exports = Request
