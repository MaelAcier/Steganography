var fs = require('fs')
var path = require('path')

const secret = `THIS IS A SECRET SO DONT TELL`

const img = path.join( __dirname , "../test/small_test.bmp" )

var image = {
    buffer: undefined,
    path: undefined,
    availableBytes: undefined,
    read: function (url) { 
        fs.readFile(url, function(err, data) {  
            if (err) throw err
            if (String.fromCharCode( data[0] ) + String.fromCharCode( data[1] ) === "BM"){
                image.buffer = data         
                image.path = url
                image.availableBytes = (getFileSizeInBytes(image.path)-54)/4
                console.log(image)
                //encode()
            } else {
                console.log("This is not a bitmap image.")
            }
        })
    }
}

var file = {
    title: undefined,
    message: undefined,
    read: function () {
        fs.readFile(file, function(err, buffer) {  
            if (err) throw err
            
        })
    }
}

image.read(img)
file.message = secret

function encode() {
    if (file.message === undefined || image.buffer === undefined){
        console.log(`Missing message or image`)
        console.log(file.message, image.buffer)
    } else {
        console.log(`Message to encode: ${file.message}`)
        console.log(`Image to encode: ${image.path}`)
        const writeStream = fs.createWriteStream(image.path, {flags: 'r+', start:54})

        file.title = ""
        let bin = headerMode( file.message, file.title)
        //let bin = basicMode( message )
        bin = cutTwoDigits( bin )

        let output = transform( bin, image.buffer )
        writeStream.write(output)
        console.log("Message written.")
    } 
}

function headerMode( message, title){
    return header( message, title ) + messageToBinary( title ) + messageToBinary( message )
}

function basicMode( message ){
    return messageToBinary( message )
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

function getFileSizeInBytes(filename) {
    var stats = fs.statSync(filename)
    var fileSizeInBytes = stats["size"]
    return fileSizeInBytes
}
