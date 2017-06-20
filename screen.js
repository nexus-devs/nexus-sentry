const tesseract = require("node-tesseract")
const sharp = require("sharp")
const ss = require("screenshot-desktop")
const fs = require("fs")
const path = __dirname + "/.tmp/screen.png"


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
                        .toFile(path, () => resolve() )
        })
    }

    ocr() {
        return new Promise((resolve, reject) => {
            tesseract.process(path, (err, message) => {
                resolve(message)
            })
        })
    }
}

module.exports = new Screen
