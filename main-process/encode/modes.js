const settings = require("../settings.json")

var modes = {
    header: (name, bin ) => {
        let messageLength = addZero( (bin.length*2).toString(2), settings.headerSize.message*8 )
        let messageLengthBin = divideString(messageLength)
        if (name){
            let nameLength = addZero( (name.length*2).toString(2), settings.headerSize.name*8 )
            var nameLengthBin = divideString(nameLength)
        } else {
            let nameLength = addZero( "".toString(2), settings.headerSize.name*8 )
            var nameLengthBin = divideString(nameLength)
        }
        return messageLengthBin.concat(nameLengthBin,name,bin)
    }

}

function addZero ( string, size ) {
    return string.length >= size ? string : new Array(size - string.length + 1).join("0") + string
}

function divideString ( data ) {
    return data.match(/.{1,2}/g)
}

module.exports = modes
