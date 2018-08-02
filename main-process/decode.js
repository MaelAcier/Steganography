var fs = require('fs')
var path = require('path')

const img = path.join( __dirname , "../test/img_test.bmp" )

decode(img)

function decode( file ) {
    console.log(`File to decode: ${file}`)
    
    fs.readFile( file, function(err, buffer) {  
        if (err) throw err
        var messageLength
        var titleLength
        var title
        var message
        extract( buffer, 0, 64, (bin) =>{
            messageLength = parseInt(bin, 2)
        })
        extract( buffer, 64, 72, (bin) =>{
            titleLength = parseInt(bin, 2)
        })
        if (titleLength > 0){
            extract( buffer, 72, 72+titleLength, (bin) =>{
                title = bin
            })
        } else title = undefined
        extract( buffer, 72+titleLength, 72+titleLength+messageLength*8, (bin) =>{
            message = bin
            message = analyze(bin)
        })
        console.log(title)
        console.log(message)
    })
}

function extract( buffer, start, end, callback ){
    start /= 2
    end /= 2
    buffer = buffer.slice(54 + start, 54 + end)
    let size = end - start
    var data = ""
    for (i=0;i<size;i++){
        let bin = (buffer[i]%4).toString(2)
        data += addZero( bin, 2 )
    }
    callback(data)
}

function analyze( binary ){
    let bytes = binary.match(/.{1,8}/g)
    var output = ""
    for (i=0;i<bytes.length;i++){
        let byte = parseInt(bytes[i], 2)
        output += String.fromCharCode( byte )
    }
    return output
}

function addZero( string, size ) {
    return string.length >= size ? string : new Array(size - string.length + 1).join("0") + string
}
