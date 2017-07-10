const tesseract = require("node-tesseract")
const sharp = require("sharp")
const screen = require("screen-info")
const ss = require("screenshot-desktop")
const fs = require("fs")

// Ensure .tmp path exists, or else screen won't be saved
fs.existsSync("/../.tmp") ? null : fs.mkdirSync("/../.tmp")


/**
 * Screen Parser
 */
class Screen {
	constructor(a, b) {
		this.main = screen.main()
		this.all = screen.all()
		this.path = __dirname + "/../.tmp/screen.png"
		this.tessOptions = {
			l: 'eng',
			psm: 6
		}

		// Cropping coordinates
		this.anchorA = a || {
			x: 0,
			y: 0
		}
		this.anchorB = b || {
			x: this.main.width,
			y: this.main.height
		}
		this.width = this.anchorB.x - this.anchorA.x
		this.height = this.anchorB.y - this.anchorA.y
	}


	/**
	 * Fully read content from the given screen size
	 */
    read() {
        this.progress = new Promise((resolve, reject) => {
            ss().then((image) => this.optimize(image))
                .then(() => this.ocr())
                .then(resolve)
        })
        return this.progress
    }


	/**
	 * Enhance screenshot for tesseract usage
	 * See ./tmp/screen.png for result
	 */
    optimize(image) {
        return new Promise((resolve, reject) => {
            sharp(image).extract({
							left: this.anchorA.x,
							top: this.anchorA.y,
							width: this.anchorB.x - this.anchorA.x,
							height: this.anchorB.y - this.anchorA.y
						})
						.greyscale()
                        .negate()
						.threshold(165)
						.resize(this.width * 2, this.height * 2)
                        .toFile(this.path, err => {
							err ? console.log(err) : resolve()
						})
        })
    }


	/**
	 * Run tesseract, return interpreted text
	 */
    ocr() {
        return new Promise((resolve, reject) => {
            tesseract.process(this.path, this.tessOptions, (err, message) => {
                err ? console.log(err) : resolve(message)
            })
        })
    }
}

module.exports = Screen
