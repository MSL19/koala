var http = require('http')
  , fs = require('fs')
  , options

options = {
    host: 'api.agromonitoring.com'
  , port: 80
  , path: '/image/1.0/1005cfafa80/5d0752b36dae90004761d1b7?appid=cda3de7380c305987a9346a110328670'
}

var request = http.get(options, function(res){
    var imagedata = ''
    res.setEncoding('binary')

    res.on('data', function(chunk){
        imagedata += chunk
    })

    res.on('end', function(){
        fs.writeFile('logo.png', imagedata, 'binary', function(err){
            if (err) throw err
            console.log('File saved.')
        })
    })

})