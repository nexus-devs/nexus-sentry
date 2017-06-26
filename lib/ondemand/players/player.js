const BaseInfo = require("./baseInfo.js")

class Player {
    constructor(username) {
        this.name = username
    }


    /**
     * Helper function to add keys from sub-data to player object
     */
    add(object) {
        for (let key in object) {
            this[key] = object[key]
        }
    }


    /**
     * Get Data from profile intro screen
     */
    parseBaseInfo(text) {
        this.add(new BaseInfo(text))
        console.log(this)
    }
}

module.exports = Player
