const _ = require("lodash")
const selling = ["wts", "selling", "wtsell"]
const buying = ["wtb", "buying", "wtbuy"]
const componentSubstitutes = {
    Blueprint: ["bp"],
    Systems: ["system", "sys"],
    Chassis: ["chas"]
}

class Request {

    /**
     * Something something
     */
    constructor(message, items) {
        this.raw = message
        this.message = message.split("[").join(" ")
                              .split("]").join(" ")
                              .split("  ").join(" ")
                              .split(" ")
        this.interpret(items)
    }


    /**
     * Transforms given message into array of offers
     */
    interpret(items) {

        // First word always user
        this.getUser()

        // Get markers where new item starts
        this.user ? this.getMarkers(items) : null

        // Interpret the resulting partitions individually
        this.partitions ? this.getOffers() : null

        // Prepare for output
        this.offers ? this.cleanOffers() : null
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
                i += item.name.split(" ").length - 1 // skip to next word
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

        this.partitions = partitions
    }


    /**
     * Check if item contained in item list
     */
    matchItem(i, items) {
        let matched = undefined
        for (let j = 0; j < items.length; j++) {
            let item = items[j].name ? items[j].name.split(" ") : console.log(items[j] + " " + typeof items)

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
        this.offers = []
        this.getOfferType()
        this.getComponents()
        this.getValue()
    }


    /**
     * See if we can find any offer type keyword like 'selling'
     * If not, assign current index of detected keywords
     * If yes, increase index and save keyword in detected list
     */
    getOfferType() {
        let index = []

        // First pass, find offer indices
        for (let partition of this.partitions) {
            for (let word of partition.message) {
                if (selling.includes(word.toLowerCase())) {
                    index.push({
                        type: "Selling",
                        index: partition.index
                    })
                } else if (buying.includes(word.toLowerCase())) {
                    index.push({
                        type: "Buying",
                        index: partition.index
                    })
                }
            }
        }

        // Second pass, match indices to partitions
        let current = 0
        for (let partition of this.partitions) {

            // No offer type given
            if (!index[current]) {
                break
            }

            // Only one offer type
            else if (!index[current + 1]) {
                partition.offer = index[current].type
            }

            // Multiple offers
            else if (partition.index < index[current + 1].index) {
                partition.offer = index[current].type
            } else if (partition.index >= index[current + 1].index) {
                partition.offer = index[current].type

                // More offer types available?
                if (index[current + 1]) current++
            }
        }
    }


    /**
     * Look for components in given partition
     * If multiple components detected, expect them to belong to the partition's
     * parent item.
     */
    getComponents() {
        for (let partition of this.partitions) {

            let offer = {
                user: this.user,
                offer: partition.offer,
                item: partition.item.name,
                component: "Set", // default if none other found
                price: null, // overwritten in this.getValue()
                rank: 0, // "
                maxRank: partition.item.ranks,
                count: 1, // "
                index: partition.index,
                subIndex: 0,
                message: partition.message,
                createdAt: new Date
            }

            // Iterate through each word
            for (let i = 0; i < partition.message.length; i++) {
                let word = partition.message[i]
                this.matchComponentSubstitutes(word)

                // Match against components from api
                for (let component of partition.item.components) {
                    let cwords = component.split(" ")

                    // Component is single word
                    if (cwords.length < 2) {
                        this.addSingleComponent(partition, component, offer, i)
                    }

                    // Component has multiple words, at least first matches
                    else if (word.toLowerCase().includes(cwords[0].toLowerCase())) {
                        this.addMultiComponent(partition, component, offer, i)
                    }
                }
            }

            // No component found, push full set
            offer.component === "Set" ? this.offers.push(offer) : null
        }
    }


    /**
     * Replace component with possible variation
     */
    matchComponentSubstitutes(component) {
        for (let substitute in componentSubstitutes) {
            if (componentSubstitutes[substitute].toLowerCase() === component.toLowerCase())) {
                component = substitute
            }
        }
    }


    /**
     * Component consists of single word
     */
    addSingleComponent(partition, component, offer, i) {
        let word = partition.message[i]
        if (word.toLowerCase().includes(component.toLowerCase())) {
            offer.component = component
            offer.subIndex = i
            this.offers.push(offer)
        }
    }


    /**
     * Component has multiple words, matches further if first one does
     */
    addMultiComponent(partition, component, offer, i) {
        let cwords = component.split(" ")
        for (let j = 1; j < cwords.length; j++) {
            let nextWord = partition.message[i + j]

            // Next word matches
            if (nextWord && nextWord.toLowerCase().includes(cwords[j].toLowerCase()) {

                // Matched until end, clone & push offer (clone so it can't be mutated)
                if (j === cwords.length - 1) {
                    offer.component = component
                    offer.subIndex = i
                    this.offers.push(_.cloneDeep(offer))
                    i += cwords.length - 1 // skip to next
                }
            }

            // Next word not matching
            else {
                break
            }
        }
    }


    /**
     * Get numerical values for request.
     * Price, rank, item count
     */
    getValue() {
        for (let j = 0; j < this.offers.length; j++) {
            let offer = this.offers[j]
            offer.subMessage = offer.message.slice(offer.subIndex, (this.offers[j + 1] && this.offers[j + 1].item === offer.item) ? this.offers[j + 1].subIndex : offer.message.length)

            // Detect values
            // NOTE: this.message[offer.index + offer.subIndex + i] equals offer.subMessage,
            // but we need to check for words before the current item partition
            // e.g. "3x Tigris Prime" would otherwise not be detected since the partition
            // starts at Tigris Prime
            for (let i = 0; i < offer.subMessage.length && this.message[offer.index + offer.subIndex + i]; i++) {


                /**
                 * Detection conditions separate to make if conditions readable
                 */
                let inspect = (index => {
                    return this.message[offer.index + offer.subIndex + index]
                })

                // Item count conditions
                let containsDecimalX = /(\dx)|(x\d)/.test(inspect(i).toLowerCase())
                let containsDecimalXPrevious = inspect(i - 1) && /(\dx)|(x\d)/.test(inspect(i - 1).toLowerCase())
                let containsDecimalPreviousX = /\d/.test(inspect(i)) && inspect(i - 1) === "x"
                let containsDecimalNextX = /\d/.test(inspect(i)) && inspect(i + 1) === "x"

                // Item rank conditions
                let containsDecimalR = /(\dr)|(r\d)/.test(inspect(i).toLowerCase())
                let containsDecimalRank = /\d/.test(inspect(i) && inspect(i).toLowerCase().includes("rank"))
                let containsDecimalPreviousRank = inspect(i - 1) && /\d/.test(inspect(i) && inspect(i - 1).toLowerCase() === "rank")

                // Item Price Conditions
                let containsDecimal = /\d/.test(inspect(i))

                // Parsed Value
                let parsedInt = parseInt(inspect(i).replace(/\D/g,""))


                /**
                 * Actual detection conditions
                 */

                // Word is item count?
                if (containsDecimalX || containsDecimalXPrevious || containsDecimalPreviousX || containsDecimalNextX) {

                    // Count is outside of partition
                    if (containsDecimalXPrevious) {
                        offer.count = parseInt(inspect(i - 1).replace(/\D/g,""))
                        // Reset count of previous offer
                        if (this.offers[j - 1]) {
                            this.offers[j - 1].count = 1
                        }
                    } else {
                        offer.count = offer.count > 1 ? offer.count : parsedInt
                    }
                }

                // Word is rank?
                else if (containsDecimalR || containsDecimalRank || containsDecimalPreviousRank) {
                    offer.rank = offer.rank > 1 || parsedInt > offer.maxRank ? offer.rank : parsedInt
                }

                // Word is price if it contains decimals
                else if (containsDecimal) {
                    offer.price = offer.price ? offer.price : parsedInt
                }
            }
        }
    }


    /**
     * Remove unnecessary keys from offers
     */
    cleanOffers() {
        for (let offer of this.offers) {
            delete offer.index
            delete offer.subIndex
            delete offer.maxRank
            delete offer.message

            offer.rawMessage = this.raw
            offer.subMessage = offer.subMessage.join ? offer.subMessage.join(" ") : offer.subMessage

            // Assume Selling if offer undefined
            // Only occurs if no Selling/Buying was given
            // Usually happens when weird people grief for attention (sellers)
            offer.offer = offer.offer ? offer.offer : "Selling"
        }
    }
}

module.exports = Request
