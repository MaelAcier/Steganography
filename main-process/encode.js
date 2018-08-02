var fs = require('fs')
var path = require('path')

var secret = `THIS IS A SECRET`

const img = path.join( __dirname , "../img_test.bmp" )

//encode( secret, img )

function encode( message, file ) {
    console.log(`Message to encode: ${message}`)
    console.log(`File to encode: ${file}`)

    const writeStream = fs.createWriteStream(file, {flags: 'r+', start:54})
    let binaryToEncode = []

    for(i=0;i<message.length;i++) {
        let letterToASCII = message.charCodeAt(i)
        let ASCIItoBinary = parseInt(letterToASCII, 10).toString(2)
        let binaryToByte = ( "00000000" + ASCIItoBinary ).substring( ASCIItoBinary.length )
        let decompose = binaryToByte.match(/.{1,2}/g)
        binaryToEncode = binaryToEncode.concat(decompose)
    }

    fs.readFile(file, function(err, buffer) {  
        if (err) throw err
        buffer = buffer.slice(54, 54+ binaryToEncode.length)
        
        for (i=0;i<buffer.length;i++){
            buffer[i] -= buffer[i]%4
            buffer[i] += parseInt(binaryToEncode[i], 2)
        }

        writeStream.write(buffer)
    })
}
