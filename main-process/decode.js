var fs = require('fs')
var path = require('path')

const img = path.join( __dirname , "../img_test.bmp" )
const txt = path.join( __dirname , "../txt_test.txt" )
const writeStream = fs.createWriteStream(txt)

decode(img)

var message = ""


function decode( file ) {
    console.log(`File to decode: ${file}`)

    fs.readFile( file, function(err, buffer) {  
        if (err) throw err 
        extract( buffer, (binary) =>{
            analyze(binary, (message) => {
                console.log(message)
                writeStream.write(message)
            })
        })
    })
}


function extract( buffer, callback ){
    buffer = buffer.slice(54)
    let size = buffer.length/10
    console.log(size)
    let data = ""
    for (i=0;i<size;i++){
        let extract = (buffer[i]%4).toString(2)
        data += ( "00" + extract ).substring( extract.length )
    }
    callback(data)
}

function analyze( binary, callback){
    let bytes = binary.match(/.{1,8}/g)
    for (i=0;i<bytes.length;i++){
        let byte = parseInt(bytes[i], 2)
        message += String.fromCharCode( byte )
    }
    callback(message)
}

