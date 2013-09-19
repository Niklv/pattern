var express = require('express');
var app = express();
var api = require('api');

app.configure(function(){

});


app.use(express.static(__dirname + '/public'));

app.get('/convertToB64', function (req, res) {
    loadBase64Image("http://2.bp.blogspot.com/-TltX5DwBl7o/UEulpNr4JuI/AAAAAAAAABI/lPg1R1GUbeM/s1600/bunny.jpg", function (image, prefix) {
        res.send('<img src="' + prefix + image + '" />');
    });
});

app.listen(15155);