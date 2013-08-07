var CANVAS_WIDTH = 300;
var CANVAS_HEIGHT = 300;
var canvas;

var PatternPart = Backbone.Model.extend({
    initialize: function () {
        this.set({
            angle: 0,
            color: null,
            opacity: 1,
            width: 100,
            height: 100,
            overlay: null,
            count: 0,
            placement_type: "circle", //random, circle
            angle_delta: 0,
            grid_type: 9, //9, 25, 49
            x: 0,
            y: 0
        });
    }
});

var PatternPartControlsView = Backbone.View.extend({
    tagName: "div",
    className: "pattern-part-controls",
    template: _.template(""),
    init_part_controls: function () {
        this.$el.find('.slider').slider().on('slide', function (e) {
            e.value = e.value.toPrecision(2);
            $(this).slider('setValue', e.value);
        });
    },
    render: function () {
        this.$el.html(this.template(this.model.attributes));
        this.init_part_controls();
        console.log(this);
        return this;
    }
});

var model = new PatternPart({
    type: "img"
});

var view = new PatternPartControlsView({
    model: model
});

view.render();


function init() {
    console.log("init app and controls");
    $('.slider').slider({handle:"triangle"}).on('slide', function (e) {
        e.value = e.value.toPrecision(2);
        $(this).slider('setValue', e.value);
    });
    $('.colorpicker').colorpicker({format:"rgba"});
    $('#upload.btn').click(upload);
    $('#render.btn').click(render);
    $('#file-uploader').change(handle_image);
    init_canvas();
}

function add_part() {

}

function init_canvas() {
    canvas = new fabric.Canvas("canvas");
    canvas.setWidth(CANVAS_WIDTH);
    canvas.setHeight(CANVAS_HEIGHT);
    canvas.setBackgroundColor("#FFF");
}

function upload() {
    $('#file-uploader').click();
}

function handle_image(e) {
    var reader = new FileReader();
    reader.onload = function (event) {
        var imgObj = new Image();
        imgObj.src = event.target.result;

        imgObj.onload = function () {
            var image = new fabric.Image(imgObj);
            image.set({
                left: 250,
                top: 250,
                angle: 20,
                padding: 10,
                cornersize: 10
            });
            canvas.add(image);
        }
    };
    reader.readAsDataURL(e.target.files[0]);
}

function render() {
    var rectangle = new fabric.Rect({ left: 100,
        top: 100,
        fill: 'red',
        width: 20,
        height: 20,
        angle: 45});
    canvas.add(rectangle);
    canvas.renderAll();
}

init();


//test
// Check for the various File API support.
/*
 if (window.File && window.FileReader && window.FileList && window.Blob) {
 // Great success! All the File APIs are supported.
 } else {
 alert('The File APIs are not fully supported in this browser.');
 }*/
