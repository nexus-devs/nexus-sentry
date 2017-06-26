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
            guide: false
        }
        this.mastery = {
            rankNumber: 0,
            rankName: "Unranked",
            xp: 0,
            xpUntilNextRank: 2500,
            nextRank: "Initiate",
        }
        this.clan = {}
        this.marked = {}
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
                lines: [],
                stalker: false,
                grustrag_three: false,
                zanuka: false
            }
        }
        let current = null

        // Split into logical parts
        text.split(/\r?\n/).forEach(line => {

            // Non-Empty line always starts with character
            if (line[0] === undefined || line[0] === " ") return

            for (let partition in partitions) {
                current = line.toLowerCase().includes(partition) ? partition : current
            }

            if (current) {
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
        detected.lines.forEach(line => {
            if (line.toLowerCase().includes("founder")) {
                this.accolades.founder = true
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
                    this.mastery.rankName = rank
                    this.mastery.rankNumber = i
                    this.mastery.nextRank = masteryRanks[i + 1]

                    // Full player xp is right below rank name
                    let next = parseInt(detected.lines[index + 1].replace(/\D/g,""))
                    this.mastery.xp = next

                    // Xp progress is 1 or 2 lines below full player xp
                    next = parseInt(detected.lines[index + 2].replace(/\D/g,""))
                    if (!Number.isNaN(next)) {
                        this.mastery.xpUntilNextRank = next
                    } else {
                        next = parseInt(detected.lines[index + 3].replace(/\D/g,""))
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
            if (line.toLowerCase().includes("clan rank")) {
                this.clan.name = detected.lines[index - 1]
                this.clan.type = line.toLowerCase()
            }
        })
    }


    /**
     * Marked by who?
     */
    parseMarked(detected) {
        if (detected.lines[1].toLowerCase().includes("stalker")) {
            this.marked.stalker = true
        }
        if (detected.lines[1].toLowerCase().includes("grustrag")) {
            this.marked.grustrag_three = true
        }
        if (detected.lines[1].toLowerCase().includes("zanuka")) {
            this.marked.zanuka = true
        }
    }
}

module.exports = BaseInfo
