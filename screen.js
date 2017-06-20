const tesseract = require("node-tesseract")
const sharp = require("sharp")
const ss = require("screenshot-desktop")
const fs = require("fs")
const path = __dirname + "/.tmp/screen.png"
//let timer = new Date


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
        //console.log("screenshot: " + (timer - new Date) + "ms")
        //timer = new Date
        return new Promise((resolve, reject) => {
            sharp(image).greyscale()
                        .negate()
                        .normalise()
                        .toFile(path, () => resolve() )
        })
    }

    ocr() {
        //console.log("optimization: " + (timer - new Date) + "ms")
        //timer = new Date
        return new Promise((resolve, reject) => {
            tesseract.process(path, (err, message) => {
                //console.log("tesseract: " + (timer - new Date) + "ms")
                resolve(message)
            })
        })
    }
}

module.exports = new Screen
