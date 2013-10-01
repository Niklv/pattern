var env = process.env;
var express = require('express');
var app = express();
var utils = require('./utils');

console.log("Starting patter.net server");


app.use(express.static(__dirname + '/public'));

app.all('/imgtob64', function (req, res) {
    var url = req.param("img_url");
    if (url != null) {
        try {
            utils.imgtob64(url, function (image, prefix) {
                res.json({image: image, prefix: prefix, err:null});
            });
        } catch (err){
            res.json({err:err.message});
        }
    } else {
        res.json({err:"check parameters"});
    }
});

/*app.get('/library', function (req, res) {
    var id = req.param("id");
    if (id != null) {

        try {
            utils.imgtob64(url, function (image, prefix) {
                res.json({image: image, prefix: prefix, err:null});
            });
        } catch (err){
            res.json({err:err.message});
        }
    } else {
        res.send(500);
    }
});*/

app.configure("production", function () {
    app.listen(20200);
    console.log("Listen on 20200");
});

app.configure("development", function () {
    app.listen(20201);
    console.log("Listen on 20201");
});

