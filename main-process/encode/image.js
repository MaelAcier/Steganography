const path = require('path')
const fs = require('fs')

var image = {
    ini: (url, callback) => {
        if (typeof url === 'string' && url){
            image.path = url
            if (path.extname(image.path) === ".png") {
                convert()
            } else if (path.extname(image.path) === ".bmp") {
                image.buffer = fs.readFileSync(image.path)
                if (String.fromCharCode( image.buffer[0] ) + String.fromCharCode( image.buffer[1] ) === "BM") {
                    let stats = fs.statSync(image.path)
                    image.availableBytes = (stats["size"]-54)/4
                    return callback(null, {
                        path: url,
                        availableBytes: image.availableBytes,
                        buffer: image.buffer
                    })
                } else {
                    return callback("This is not a bitmap image.")
                }
            } else {
                return callback("This is not a valid image.")
            }
        } else {
            return callback("This is not a valid path.")
        }
    }
}

module.exports = image
