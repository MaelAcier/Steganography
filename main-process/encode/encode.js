const fs = require('fs')
const path = require('path')
const image = require('./image.js')
const message = require('./message.js')
const modes = require('./modes.js')

const secret = `THIS IS A SECRET SO DONT TELL`

const img = path.join( __dirname , "../../test/test.bmp" )
const img2 = path.join( __dirname , "../../test/small_test.bmp" )
const txt = path.join( __dirname , "../../test/txt_test.txt" )

var index = {
    images: {},
    message: {}
}

image.ini(img, (err, data) => {
    if (err) {
        console.error("err:",err)
    } else {
        index.images[data.path] = {}
        index.images[data.path].availableBytes = data.availableBytes
        index.images[data.path].buffer = data.buffer
    }
})

message.ini(undefined, secret, (err, data) => {
    if (err) {
        console.error("err:",err)
    } else {
        index.message.name = data.name
        index.message.bin = data.bin
    }
})

//encode('header')

function encode (mode, encryption) {
    var binary
    if (mode === 'basic'){
        if(index.message.name){
            binary = modes.header(index.message.name, index.message.bin)
        } else {
            binary = index.message.bin
        }
    } else if (mode === 'header') {
        binary = modes.header(index.message.name, index.message.bin)
    }

    const writeStream = fs.createWriteStream(image.path, {flags: 'r+', start:54})
    let output = merge(binary, index.images[img].buffer)
    writeStream.write(output)
    console.log("Message written.")
}

function merge( bin, buffer) {
    buffer = buffer.slice(54, 54+ bin.length)
        
    for (i=0;i<buffer.length;i++){
        buffer[i] -= buffer[i]%4
        buffer[i] += parseInt(bin[i], 2)
    }
    return buffer
}
