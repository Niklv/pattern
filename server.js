var express = require('express'),
    request = require('request');

var app = express();

var loadBase64Image = function (url, callback) {
    request({url: url, encoding: null}, function (err, res, body) {
        if (!err && res.statusCode == 200) {
            var base64prefix = 'data:' + res.headers['content-type'] + ';base64,'
                , image = body.toString('base64');
            if (typeof callback == 'function') {
                callback(image, base64prefix);
            }
        } else {
            throw new Error('Can not download image');
        }
    });
};

app.use(express.static(__dirname + '/public'));

app.get('/convertToB64', function (req, res) {
    loadBase64Image("http://2.bp.blogspot.com/-TltX5DwBl7o/UEulpNr4JuI/AAAAAAAAABI/lPg1R1GUbeM/s1600/bunny.jpg", function (image, prefix) {
        res.send('<img src="' + prefix + image + '" />');
    });
});

app.listen(15155);