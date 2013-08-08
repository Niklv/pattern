var CANVAS_WIDTH = 300;
var CANVAS_HEIGHT = 300;
var ANIM_TIME = 100;
var canvas;

var PatternPart = Backbone.Model.extend({
    initialize: function () {
        this.set({
            id: Math.round(Math.random() * 1000000),
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
        });
    }
});

var PatternPartControlsView = Backbone.View.extend({
    tagName: "div",
    className: "row pattern-part thumbnail",
    template: _.template($("#part-settings-tmpl").html()),
    init_controls: function () {
        //console.log(this.model.attributes);
        this.$el.find('.colorpicker').colorpicker({format: "rgba"});
        this.$el.find('.slider').slider().on('slide', function (e) {
            e.value = e.value.toFixed(2);
            $(this).slider('setValue', e.value);
        });
        this.$el.find('input[type="radio"]').change(_.bind(this.change_settings_order, this));
        this.$el.find('.count .slider').on("slide", _.bind(this.change_settings_order, this));
        this.change_settings_order();
        return this;
    },
    change_settings_order: function () {
        var isCircle = this.$el.find('.placement input:checked').val() == "circle";
        var isRandom = this.$el.find('.placement input:checked').val() == "random";
        var isOneItem = this.$el.find('.count .slider').slider('getValue') == 1;
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
        "click button.close": "remove",
        "slide input": "slide",
        "change input[type=radio]": "radio_changed"
    },
    remove: function () {
        this.$el.remove();
    },
    slide: function (ev) {
        var p_name = $(ev.target).attr('id').replace("-of-obj", "").replace("-", "_");
        this.model.set(p_name, parseFloat(ev.value));
        //console.log(this.model.attributes);
    },
    radio_changed: function (ev) {
        var p_name = $(ev.target).attr('name').replace("-of-obj", "").replace("-", "_");
        if (p_name == "grid")
            this.model.set(p_name, parseInt($(ev.target).val()));
        else if (p_name == "placement")
            this.model.set(p_name, $(ev.target).val());
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
        var model = new PatternPart({type: "img", img: imgObj});
        var view = new PatternPartControlsView({model: model});
        view.render().place().init_controls();

        imgObj.onload = function () {
            /*
             var image = new fabric.Image(imgObj);
             image.set({
             left: 250,
             top: 250,
             angle: 20,
             padding: 10,
             cornersize: 10
             });
             canvas.add(image);*/
        };
        $(e.target).val("");
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
