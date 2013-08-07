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
    className: "row",
    template: _.template('<div class="row">
        <div class="pattern-part">
    <div class="col-lg-4 col-sm-4">
        <img class="part-img"
        src="http://icons.iconarchive.com/icons/enhancedlabs/lha-objects/128/Filetype-IMG-icon.png">
        </div>
        <div class="col-lg-8 col-sm-8 form-horizontal pattern-part-controls">
            <div class="form-group">
                <label class="col-lg-3 control-label" for="angle-of-obj">Angle</label>

                <div class="col-lg-9">
                    <input id="angle-of-obj" type="number" class="slider form-control" value=""
                    data-slider-min="0"
                    data-slider-max="360" data-slider-step="1" data-slider-value="0">
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-lg-3 control-label" for="opacity-of-obj">Opacity</label>

                    <div class="col-lg-9">
                        <input id="opacity-of-obj" type="number" class="slider form-control" value=""
                        data-slider-min="0"
                        data-slider-max="1" data-slider-step="0.01" data-slider-value="1">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-lg-3 control-label" for="width-of-obj">Width</label>

                        <div class="col-lg-9">
                            <input id="width-of-obj" type="number" class="slider form-control" value=""
                            data-slider-min="0"
                            data-slider-max="5" data-slider-step="0.01" data-slider-value="1">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-lg-3 control-label" for="height-of-obj">Height</label>

                            <div class="col-lg-9">
                                <input id="height-of-obj" type="number" class="slider form-control" value=""
                                data-slider-min="0"
                                data-slider-max="5" data-slider-step="0.01" data-slider-value="1">
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-lg-3 control-label">Grid</label>

                                <div class="col-lg-9">
                                    <div class="radio-inline">
                                        <label>
                                            <input type="radio" name="gridsize" id="gridsize1" value="9" checked>
                                            9
                                            </label>
                                        </div>
                                        <div class="radio-inline">
                                            <label>
                                                <input type="radio" name="gridsize" id="gridsize2" value="25">
                                                25
                                                </label>
                                            </div>
                                            <div class="radio-inline">
                                                <label>
                                                    <input type="radio" name="gridsize" id="gridsize3" value="49">
                                                    49
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label class="col-lg-3 control-label" for="count-of-obj">Parts</label>

                                            <div class="col-lg-9">
                                                <input id="count-of-obj" type="number" class="slider form-control" value=""
                                                data-slider-min="0"
                                                data-slider-max="40" data-slider-step="1" data-slider-value="5">
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label class="col-lg-3 control-label">Placement</label>

                                                <div class="col-lg-9">
                                                    <div class="radio-inline">
                                                        <label>
                                                            <input type="radio" name="gridsize-of-obj" id="placement1" value="random" checked>
                                                            Random
                                                            </label>
                                                        </div>
                                                        <div class="radio-inline">
                                                            <label>
                                                                <input type="radio" name="gridsize-of-obj" id="placement2" value="circle">
                                                                Circle
                                                                </label>
                                                            </div>
                                                            <div class="form-group">
                                                                <label class="col-lg-3 control-label" for="color-of-obj">Color</label>

                                                                <div class="col-lg-9">
                                                                    <div class="input-append color" data-color-format="rgba">
                                                                        <input id="color-of-obj" class="colorpicker input-sm" type="text" value="rgba(0, 0, 0, 0)" >
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>'),
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
