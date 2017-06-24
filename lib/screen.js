const tesseract = require("node-tesseract")
const sharp = require("sharp")
const ss = require("screenshot-desktop")
const fs = require("fs")
const path = __dirname + "/../.tmp/screen.png"
const tessOptions = {
	l: 'eng',
	psm: 6
}

// Ensure .tmp path exists, or else screen won't be saved
fs.existsSync("/../.tmp") ? null : fs.mkdirSync("/../.tmp")


/**
 * Screen Parser
 */
class Screen {
    read() {
        this.progress = new Promise((resolve, reject) => {
            ss().then(this.optimize)
                .then(this.ocr)
                .then(resolve)
        })
        return this.progress
    }

    optimize(image) {
        return new Promise((resolve, reject) => {
            sharp(image).greyscale()
                        .negate()
                        .toFile(path, () => resolve())
        })
    }

    ocr() {
        return new Promise((resolve, reject) => {
            tesseract.process(path, tessOptions, (err, message) => {
                err ? console.log(err) : resolve(message)
            })
        })
    }
}

module.exports = new Screen
