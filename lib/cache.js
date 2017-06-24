/**
 * Cache to reduce traffic/disk usage from very active people
 */
class Cache {
    constructor() {
        this.offers = []
        this.duration = 180000 // in ms
    }


    /**
     * Find given object in cache
     */
    find(object) {
        let found = null
        let index = null

        this.offers.forEach((offer, i) => {
            if (offer.user === object.user &&
                offer.offer === object.offer &&
                offer.item === object.item &&
                offer.component === object.component)
            {
                found = offer
                index = i
            }
        })

        if (found && index) {
            return {
                found: found,
                index: index
            }
        } else {
            return null
        }
    }


    /**
     * Add offer to cache if new
     */
    add(offer) {
        let cacheData = {
            user: offer.user,
            offer: offer.offer,
            item: offer.item,
            component: offer.component,
            createdAt: new Date
        }
        this.find(cacheData) ? null : this.offers.push(cacheData)
    }


    /**
     * Remove cached object from index or object match
     */
    remove(value) {
        let index = null
        if (typeof value === "number") {
            index = value
        } else {
            index = this.find(value).index
        }
        this.offers = this.offers.splice(index, 1)
    }


    /**
     * Check if cached object is expired
     */
    isExpired(offer) {
        if (new Date - offer.createdAt > this.duration) {
            this.remove(offer)
            return true
        } else {
            return false
        }
    }
}

module.exports = new Cache
