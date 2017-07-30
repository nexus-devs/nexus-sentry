const masteryRanks = ["Unranked", "Initiate", "Silver Initiate", "Gold Initiate",
                      "Novice", "Silver Novice", "Gold Novice", "Disciple",
                      "Silver Disciple", "Gold Disciple", "Seeker",
                      "Silver Seeker", "Gold Seeker", "Hunter", "Silver Hunter",
                      "Gold Hunter", "Eagle", "Silver Eagle", "Gold Eagle",
                      "Tiger", "Silver Tiger", "Gold Tiger", "Dragon",
                      "Silver Dragon", "Gold Dragon", "Sage", "Silver Sage",
                      "Gold Sage", "Master", "Middle Master", "Grand Master"]

/**
 * Describes data on initial page of user profiles
 */
class BaseInfo {
    constructor(text) {
        this.accolades = {
            founder: false,
            guide: false,
            moderator: false,
            partner: false,
            staff: false
        }
        this.mastery = {
            rank: {
                name: "Unranked",
                number: 0,
                next: "Initiate"
            },
            xp: 0,
            xpUntilNextRank: 2500
        }
        this.clan = {
            name: "Unaffiliated",
            rank: null,
            type: null
        }
        this.marked = {
            stalker: false,
            g3: false,
            zanuka: false
        }
        this.parse(text)
    }


    /**
     * Parse base data from given text
     */
    parse(text) {
        let partitions = {
            accolades: {
                lines: []
            },
            mastery: {
                lines: []
            },
            clan: {
                lines: []
            },
            marked: {
                lines: []
            }
        }
        let current = null

        // Split into logical parts
        text.split(/\r?\n/).forEach((line, index) => {

            // Non-Empty line always starts with character
            if (line[0] === undefined || line[0] === " ") return

            for (let partition in partitions) {
                current = line.toLowerCase().includes(partition) ? partition : current
            }

            if (current) {
                // Add last line as well to ensure completeness
                if (partitions[current].lines.length < 1 && text[index - 1]) {
                    partitions[current].lines.push(text.split(/\r?\n/)[index - 1])
                }
                partitions[current].lines.push(line)
            }
        })

        this.parseAccolades(partitions.accolades)
        this.parseMastery(partitions.mastery)
        this.parseClan(partitions.clan)
        this.parseMarked(partitions.marked)
    }


    /**
     * Accolades, consisting of Founder/Guide of the Lotus information
     */
    parseAccolades(detected) {
        detected.lines.forEach((line, index) => {
            console.log(line.toLowerCase())
            if (line.toLowerCase().includes("founder")) {
                if (detected.lines[index + 1]) {
                    let type = detected.lines[index + 1].toLowerCase()
                    if (type.includes("disciple")) {
                        this.accolades.founder = "Disciple"
                    }
                    else if (type.includes("hunter")) {
                        this.accolades.founder = "Hunter"
                    }
                    else if (type.includes("master") && !type.includes("grand")) {
                        this.accolades.founder = "Master"
                    }
                    else {
                        this.accolades.founder = "Grand Master"
                    }
                }
            }
            if (line.toLowerCase().includes("moderator")) {
                this.accolades.moderator = true
            }
            if (line.toLowerCase().includes("warf") || line.toLowerCase().includes("part")) {
                this.accolades.partner = true
            }
            if (line.toLowerCase().includes("digital extremes")) {
                this.accolades.staff = true
            }
            if (line.toLowerCase().includes("senior guide")) {
                this.accolades.guide = "Senior Guide of the Lotus"
            }
            else if (line.toLowerCase().includes("junior guide")) {
                this.accolades.guide = "Junior Guide of the Lotus"
            }
        })
    }


    /**
     * Mastery rank
     */
    parseMastery(detected) {
        detected.lines.forEach((line, index) => {
            for (let i = 0; i < masteryRanks.length; i++) {
                let rank = masteryRanks[i]
                if (line.toLowerCase() === rank.toLowerCase()) {
                    this.mastery.rank.name = rank
                    this.mastery.rank.number = i
                    this.mastery.rank.next = masteryRanks[i + 1]

                    // Full player xp is right below rank name
                    let next = detected.lines[index + 1] ? parseInt(detected.lines[index + 1].replace(/\D/g,"")) : 0
                    this.mastery.xp = next

                    // Xp progress is 1 or 2 lines below full player xp
                    next = detected.lines[index + 2] ? parseInt(detected.lines[index + 2].replace(/\D/g,"")) : 2500
                    if (!Number.isNaN(next)) {
                        this.mastery.xpUntilNextRank = next
                    } else {
                        next = detected.lines[index + 3] ? parseInt(detected.lines[index + 3].replace(/\D/g,"")) : 2500
                        this.mastery.xpUntilNextRank = next
                    }
                }
            }
        })
    }


    /**
     * Clan info
     */
    parseClan(detected) {
        detected.lines.forEach((line, index) => {
            console.log(line)
            if (line.toLowerCase().includes("clan rank")) {
                console.log("FOUND")
                this.clan.name = detected.lines[index - 1] ? detected.lines[index - 1] : "E: Not Detected"
                let type = line.toLowerCase().split(" rank")
                this.clan.type = type[0].replace(/\w\S*/g, txt => {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
                })
                this.clan.rank = parseInt(type[1].replace(/\D/g, ""))
            }
        })
    }


    /**
     * Marked by who?
     */
    parseMarked(detected) {
        detected.lines.forEach(line => {
            if (line.toLowerCase().includes("stalker")) {
                this.marked.stalker = true
            }
            if (line.toLowerCase().includes("grustrag")) {
                this.marked.g3 = true
            }
            if (line.toLowerCase().includes("zanuka")) {
                this.marked.zanuka = true
            }
        })
    }
}

module.exports = BaseInfo
