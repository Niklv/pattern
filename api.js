var request = require('request');

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

module.exports = loadBase64Image;