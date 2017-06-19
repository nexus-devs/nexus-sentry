/**
 * Integrated Tesseract lib. Not working right now.
 * const NexusSentry = require('./build/Release/addon').NexusSentry;
 * const nexus = new NexusSentry;
 */
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
                .then(this.process)
                .then(resolve)
        })
        return this.progress
    }

    optimize(image) {
        return new Promise((resolve, reject) => {
            sharp(image).greyscale()
                        .negate()
                        .normalise()
                        .toFile(path, () => resolve() )
        })
    }

    process(_this) {
        return new Promise((resolve, reject) => {
            tesseract.process(path, (err, message) => {
                resolve(message)
            })
        })
    }
}



let screen = new Screen
screen.read().then(console.log)
