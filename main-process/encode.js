var fs = require('fs')
var path = require('path')

const secret = `THIS IS A SECRET`

const img = path.join( __dirname , "../test/img_test.bmp" )

//encode( secret, img )

function encode( message, file ) {
    console.log(`Message to encode: ${message}`)
    console.log(`File to encode: ${file}`)

    let title = ""
    let bin = header( message, title ) + messageToBinary( title ) + messageToBinary( message )
    bin = cutTwoDigits( bin )

    const writeStream = fs.createWriteStream(file, {flags: 'r+', start:54})

    fs.readFile(file, function(err, buffer) {  
        if (err) throw err
        buffer = transform( bin, buffer )

        writeStream.write(buffer)
    })
}

function messageToBinary( message ) {
    var output = ""
    for( i=0; i<message.length; i++ ) {
        let letterToASCII = message.charCodeAt(i)
        let ASCIItoBinary = parseInt(letterToASCII, 10).toString(2)
        output += addZero( ASCIItoBinary, 8 )
    }
    return output
}

function transform( binary, buffer) {
    buffer = buffer.slice(54, 54+ binary.length)
        
    for (i=0;i<buffer.length;i++){
        buffer[i] -= buffer[i]%4
        buffer[i] += parseInt(binary[i], 2)
    }
    return buffer
}

function header( message, title ) {
    let messageLength = addZero( message.length.toString(2), 64 )
    if (title !== undefined){
        var titleLength = addZero( title.length.toString(2), 8 )
    } else {
        var titleLength = addZero( "".toString(2), 8 )
    }
    return messageLength + titleLength
}

function addZero( string, size ) {
    return string.length >= size ? string : new Array(size - string.length + 1).join("0") + string
}

function cutTwoDigits ( data ) {
    return data.match(/.{1,2}/g)
}
