const fs = require('fs')
const path = require('path')

var message = {
    ini: (url, text, callback) => {
        if (typeof url === 'string' && url) { //File
            message.binary = message.readFile(url)
            message.name = message.readText(path.basename(url))
            return callback(null, {
                name: message.name,
                bin: message.binary
            })
        } else if (typeof text === 'string' && text) { //Text
            message.binary = message.readText(text)
            return callback(null, {
                name: [],
                bin: message.binary
            })
        } else {
            return callback("No message or path.")
        }
    },

    readFile: (url) => {
        message.buffer = fs.readFileSync(url)
        let bin = ""
        for (i=0;i<message.buffer.length;i++){
            let convertToBinary = message.buffer[i].toString(2)
            bin += addZero(convertToBinary, 8 )
        }
        return divideString(bin)
    },

    readText: (text) => {
        let bin = ""
        for( i=0; i<text.length; i++ ) {
            let letterToBinary = text.charCodeAt(i).toString(2)
            bin += addZero( letterToBinary, 8 )
        }
        return divideString(bin)
    }
}

function addZero ( string, size ) {
    return string.length >= size ? string : new Array(size - string.length + 1).join("0") + string
}

function divideString ( data ) {
    return data.match(/.{1,2}/g)
}

module.exports = message
