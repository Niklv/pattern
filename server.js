var express = require('express');
var utils = require('./utils');

var app = express();

console.log("Starting patter.net server");
app.use(express.static(__dirname + '/source'));

app.all('/imgtob64', function (req, res) {
    var url = req.param("img_url");
    if (url != null) {
        try {
            utils.imgtob64(url, function (image, prefix) {
                res.json({image: image, prefix: prefix, err: null});
            });
        } catch (err) {
            res.json({err: err.message});
        }
    } else {
        res.json({err: "check parameters"});
    }
});

//for convertation to b64 large count of images
/*app.all('/createB64', function (req, res) {
 var fs = require('fs'), async = require('async'), arr = new Array(100);
 for (var i = 0; i < arr.length; i++)
 arr[i] = i + 1;
 async.forEach(arr, function (val, cb) {
 utils.imgtob64("http://localhost:20201/img/calculated/sample_" + val + ".png", function (image, prefix) {
 var str_to_save = JSON.stringify({image: image, prefix: prefix, err: null});
 fs.writeFile("public/img/calculated/sample_1_file_" + val + ".png.json", str_to_save, function (err) {
 if (err)
 console.log(err);
 cb();
 });
 });
 }, function () {
 res.send(200);
 });
 });*/



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
    console.log("Listen on 20200!");
});

app.configure("development", function () {
    app.listen(20201);
    console.log("Listen on 20201!");
});

