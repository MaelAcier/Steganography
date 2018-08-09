var fs = require('fs')
var path = require('path')

const img = path.join( __dirname , "../test/test.bmp" )

//decode(img)

function decode( file ) {
    console.log(`Image to decode: ${file}`)
    
    fs.readFile( file, function(err, buffer) {  
        if (err) throw err
        console.log(headerMode( buffer ))
        //console.log(basicMode( buffer, 1000 ))
    })
}

function headerMode( data ) {
    var messageLength
    var titleLength
    var title
    var message
    extract( data, 0, 64, (bin) =>{
        messageLength = parseInt(bin, 2)
    })
    extract( data, 64, 80, (bin) =>{
        
        titleLength = parseInt(bin, 2)
    })
    if (titleLength > 0){
        extract( data, 80, 80+titleLength, (bin) =>{
            title = analyze(bin)
        })
    } else title = undefined
    extract( data, 80+titleLength, 80+titleLength+messageLength, (bin) =>{
        message = analyze(bin)
    })
    return {
        title: title,
        message: message
    }
}

function basicMode( data, length ){
    var message
    extract( data, 0, length*8, (bin) =>{
        message = analyze( bin, true)
    })
    return {
        message: message
    }
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

function analyze( binary, debug){
    let bytes = binary.match(/.{1,8}/g)
    var output = ""
    for (i=0;i<bytes.length;i++){
        let byte = parseInt(bytes[i], 2)
        if (!(byte < 31 && debug === true)){
            let char = String.fromCharCode( byte )
            output += char
        }
    }
    return output
}

function addZero( string, size ) {
    return string.length >= size ? string : new Array(size - string.length + 1).join("0") + string
}
