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
//let timer = new Date


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
        //console.log("screenshot: " + (timer - new Date) + "ms")
        //timer = new Date
        return new Promise((resolve, reject) => {
            sharp(image).greyscale()
                        .negate()
                        .normalise()
                        .toFile(path, () => resolve() )
        })
    }

    process(_this) {
        //console.log("optimization: " + (timer - new Date) + "ms")
        //timer = new Date
        return new Promise((resolve, reject) => {
            tesseract.process(path, (err, message) => {
                console.log("tesseract: " + (timer - new Date) + "ms")
                resolve(message)
            })
        })
    }
}



let screen = new Screen
screen.read().then(console.log)
