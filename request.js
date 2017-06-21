class Request {

    /**
     * Something something
     */
    constructor(message, items) {
        this.message = message.split(" ")
        this.interpret(items)
    }


    /**
     * Transforms given message into array of offers
     */
    interpret(items) {

        // First word always user
        this.getUser()

        // Get markers where new item starts
        this.getMarkers(items)

        // Interpret the resulting partitions individually
        this.getOffers()
    }


    /**
     * Get first word in message
     */
    getUser() {
        this.user = this.message[0].replace(":", "")
    }


    /**
     * Match each word against item list and set partitions
     */
    getMarkers(items) {

        // Detect partition indices
        let partitions = []
        for (let i = 0; i < this.message.length; i++) {
            let item = this.matchItem(i, items)
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
        console.log(this.message.join(" "))
        console.log(partitions)
        console.log("\n")
        this.partitions = partitions
    }


    /**
     * Check if item contained in item list
     */
    matchItem(i, items) {
        let matched = undefined
        for (let j = 0; j < items.length; j++) {
            let item = items[j].name.split(" ")

            // Item contained in message? Match further words
            for (let k = 0; k < item.length; k++) {

                // Words match until end? Item found
                if (this.message[i + k] && this.message[i + k].toLowerCase().includes(item[k].toLowerCase())) {
                    matched = k === item.length - 1 ? items[j] : undefined
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


    /**
     * Takes each partitioned message and analyzes content
     */
    getOffers() {
        for (let partition in this.partitions) {
            this.getOfferType()
            this.getComponents()
            this.getValue()
        }
    }


    /**
     * See if we can find any offer type keyword like 'selling'
     * If not, assign current index of detected keywords
     * If yes, increase index and save keyword in detected list
     */
    getOfferType() {

    }


    /**
     * Look for components in given partition
     * If multiple components detected, expect them to belong to the partition's
     * parent item.
     */
    getComponents() {

    }


    /**
     * Get numerical values for request.
     * Price, rank, item count
     */
    getValue() {
        
    }
}

module.exports = Request
