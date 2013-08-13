var CANVAS_WIDTH = 300;
var CANVAS_HEIGHT = 300;
var ANIM_TIME = 200;
var canvas;


//////MODEL

var PatternPart = Backbone.Model.extend({
        fabric_obj: null,
        default: {
            angle: 0,
            color: "rgba(0, 0, 0, 0)",
            opacity: 1,
            width: 1,
            height: 1,
            overlay: null,
            count: 5,
            placement: "random", //random, circle
            angle_delta: 50,
            grid: 9, //9, 25, 49
            x: 0,
            y: 0,
            radius: 100
        },

        range: {
            angle: {
                min: 0,
                step: 1,
                max: 360
            },
            opacity: {
                min: 0,
                step: 0.01,
                max: 1
            },
            width: {
                min: 0,
                step: 1
            },
            height: {
                min: 0,
                step: 1
            },
            count: {
                min: 0,
                step: 1,
                max: 40
            },
            placement: {
                values: ["random", "circle"]
            },
            angle_delta: {
                min: 0,
                step: 1,
                max: 360
            },
            grid: {
                values: [9, 25, 49, 81]
            },
            x: {
                min: 0,
                step: 1
            },
            y: {
                min: 0,
                step: 1
            },
            radius: {
                min: 0,
                step: 1
            }
        },
        initialize: function () {
            this.set({id: Math.round(Math.random() * 1000000)});
            this.set(this.default);
            this.on("change", this.update_fabric);
        },
        fabric: function () {
            this.fabric_obj = new fabric.Image(this.get("img"));
            this.update_fabric();
            canvas.add(this.fabric_obj);
        },
        update_fabric: function () {
            console.log(fabric.Color.fromRgba(this.get("color")));
            this.fabric_obj.set({
                left: canvas.getWidth() / 2 + canvas.getWidth() * this.get("x") / 100,
                top: canvas.getHeight() / 2 + canvas.getHeight() * this.get("y") / 100,
                width: this.get("img").width * this.get("width"),
                height: this.get("img").height * this.get("height"),
                angle: this.get("angle"),
                opacity: this.get("opacity"),
                fill: this.get("color"),
                overlayFill: this.get("color")
            });
            canvas.renderAll();
        },
        remove: function () {
            canvas.fxRemove(this.fabric_obj);
        }
    })
    ;


//////COLLECTION

var PatternPartCollection = Backbone.Collection.extend({
    model: PatternPart,
    rendering: true,
    initialize: function () {
        this.on("add", this.add_model);
        this.on("remove", this.remove_model);
        //this.on("change", this.render);
    },
    add_model: function (model) {
        var view = new PatternPartControlsView({model: model});
        view.render().place().init_controls();
        model.fabric();
    },
    remove_model: function (model) {
        model.remove();
    }
    /*,
     render: function () {
     if (!this.rendering)
     return;
     console.log("render started");

     }  */
});


//////VIEW

var PatternPartControlsView = Backbone.View.extend({
    tagName: "div",
    className: "row pattern-part thumbnail",
    template: _.template($("#part-settings-tmpl").html()),
    allowed_keys: [],
    init_controls: function () {
        //console.log(this.model.attributes);
        /*this.$el.find('.colorpicker').colorpicker({format: "rgba"});
         this.$el.find('.slider').slider().on('slide', function (e) {
         e.value = e.value.toFixed(2);
         $(this).slider('setValue', e.value);
         });
         this.$el.find('input[type="radio"]').change(_.bind(this.change_settings_order, this));
         this.$el.find('.count input').on("slide", _.bind(this.change_settings_order, this));
         this.change_settings_order();*/
        this.setup_allowed_keys();
        this.$el.find(".angle div.slider").slider({
            animate: ANIM_TIME,
            min: 0,
            max: 360,
            step: 0.1,
            value: 100,
            range: "min"
        });
        this.$el.find(".angle input").val(100);
        return this;
    },
    change_settings_order: function () {
        var isCircle = this.$el.find('.placement input:checked').val() == "circle";
        var isRandom = this.$el.find('.placement input:checked').val() == "random";
        var isOneItem = this.$el.find('.count input').val() == 1;
        if (isCircle || isOneItem) {
            this.$el.find('.form-group.x').show(ANIM_TIME);
            this.$el.find('.form-group.y').show(ANIM_TIME);
        } else {
            this.$el.find('.form-group.x').hide(ANIM_TIME);
            this.$el.find('.form-group.y').hide(ANIM_TIME);
        }

        if (isCircle) {
            this.$el.find('.form-group.angle-delta').show(ANIM_TIME);
            this.$el.find('.form-group.radius').show(ANIM_TIME);
        } else if (isRandom) {
            this.$el.find('.form-group.angle-delta').hide(ANIM_TIME);
            this.$el.find('.form-group.radius').hide(ANIM_TIME);
        }
    },
    place: function () {
        var last = $('.control-panel .row.pattern-part:last-child');
        if (last.length > 0)
            last.after(this.$el);
        else
            $('.control-panel .row:first-child').after(this.$el);
        return this;
    },
    render: function () {
        this.$el.html(this.template(this.model.attributes));
        return this;
    },
    events: {
        //"click button.close": "remove",
        //"slide input": "slide",
        //"change input[type=radio]": "radio_changed",
        //"changeColor input.colorpicker": "color_changed",
        //"click btn.random": "random"
        "slide .slider": "sliderchanged",
        "input input": "inpt",
        "keypress input": "filter_number",
        "keydown input": "up_and_down"

    },
    setup_allowed_keys: function () {
        this.allowed_keys.push(45, 46); //minus and dot
        this.allowed_keys.push(48, 49, 50, 51, 52, 53, 54, 55, 56, 57); //0-9
    },
    up_and_down: function (e) {
        var key = e.keyCode;
        if (key != 38 && key != 40)
            return;
        var val = parseInt($(e.target).val() * 10000);
        var slider = $(e.target).parent().find(".slider");
        var slider_options = slider.slider("option");
        var step = slider_options.step * 10000;
        var ost = val % step;
        if (key == 38) { //key up
            if (ost)
                val += step - Math.abs(ost);
            else
                val += step;
        } else if (key == 40) {  //key down
            if (ost)
                val -= ost;
            else
                val -= step;
        }
        val /= 10000;
        val = Math.max(val, slider_options.min);
        val = Math.min(val, slider_options.max);
        $(e.target).val(val);
        slider.slider("value", val);
    },
    filter_number: function (e) {
        var key = e.keyCode;
        if (!_.contains(this.allowed_keys, key))
            e.preventDefault();
        else if (key == 46 && $(e.target).val().match(/\./g))
            e.preventDefault();
        else if (key == 45 && $(e.target).val().match(/[-]/g))
            e.preventDefault();

    },
    sliderchanged: function (e, o) {
        $(e.target).parent().parent().find("input").val(o.value);
    },
    setslider: function (e) {
        var slider = $(e.target).parent().find(".slider");
        var opt = slider.slider("option");
        var value = $(e.target).val();
        if (value == "") value = 0;
        if (isInt(opt.step))
            value = parseInt(value);
        else
            value = parseFloat(value);
        if (isNaN(value)) {
            event.preventDefault();
            return;
        }
        value = Math.max(value, opt.min);
        value = Math.min(opt.max, value);
        $(e.target).parent().find(".slider").slider("value", value);
        //$(e.target).val(value);
    },
    random: function () {

    },
    remove: function () {
        this.$el.hide(ANIM_TIME).remove();
        parts.remove(this.model);
    },
    slide: function (ev) {
        var p_name = $(ev.target).attr('id').replace("-of-obj", "").replace("-", "_");
        this.model.set(p_name, parseFloat(ev.value));
        //console.log(this.model.attributes);
    },
    radio_changed: function (ev) {
        var p_name = $(ev.target).attr("class").replace("-of-obj", "").replace("-", "_");
        if (p_name == "grid")
            this.model.set(p_name, parseInt($(ev.target).val()));
        else if (p_name == "placement")
            this.model.set(p_name, $(ev.target).val());
        //console.log(this.model.attributes);
    },
    color_changed: function (ev) {
        this.model.set("color", $(ev.target).val());
        //console.log(this.model.attributes);
    }
});


function init() {
    console.log("init app and controls");
    $('#upload.btn').click(upload);
    $('#render.btn').click(render);
    $('#file-uploader').change(handle_image);
    init_canvas();
}

function init_canvas() {
    canvas = new fabric.StaticCanvas("canvas");
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
        parts.add({type: "img", img: imgObj});
        /*
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
         };*/
        $(e.target).val("");
    };
    reader.readAsDataURL(e.target.files[0]);
}

function isInt(n) {
    return n % 1 === 0;
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


var parts = new PatternPartCollection();
init();