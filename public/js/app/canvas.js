var Canvas = Backbone.Model.extend({
    defaults: {
        color: "#ffffff",
        autoupdate: false,
        height: 300,
        width: 300,
        range: {
            width: {
                min: 0,
                step: 1,
                max: 400
            },
            height: {
                min: 0,
                step: 1,
                max: 400
            }
        }
    },
    initialize: function () {
        this.canvas();
        $(window).resize(function () {
            var off = $('canvas').offset();
            $('body').css('background-position-x', off.left).css('background-position-y', off.top);
        }).resize();
        new CanvasView({model: this});
        this.bind("change", this.update);
        this.bind("change:width", this.width);
        this.bind("change:height", this.height);
        this.bind("change:color", this.color);
        this.bind("change:autoupdate", this.update);
    },
    canvas: function () {
        this.canvas = new fabric.StaticCanvas("canvas");
        this.canvas.renderOnAddition = false;
        this.color();
        this.height();
        this.width();
        this.getWidth = _.bind(this.canvas.getWidth, this.canvas);
        this.getHeight = _.bind(this.canvas.getHeight, this.canvas);
        this.getCenter = _.bind(this.canvas.getCenter, this.canvas);
        this.add = _.bind(this.canvas.add, this.canvas);
    },
    color: function () {
        this.canvas.setBackgroundColor(this.get("color"));
    },
    width: function () {
        this.canvas.setWidth(this.get("width"));
    },
    height: function () {
        this.canvas.setHeight(this.get("height"));
    },
    removeAll: function () {
        this.canvas._objects = [];
    },
    update: function () {
        if (this.get("autoupdate")) {
            this.render_to_bg();
        } else
            this.canvas.renderAll(true);
    },
    render_to_bg: function(){
        $(window).resize();
        $('body').css('background-image', 'url(' + this.canvas.toDataURL({format: "png", quality: 1}) + ')');
    },
    download_image: function () {
        var data = this.canvas.toDataURL({format: "png", quality: 1});
        var b64 = data.split(',')[1];
        var blob = b64toBlob(b64, "image/png");
        saveAs(blob, "awesome-pattern_" + _.random(100000, 200000) + ".png");
    }
});

var CanvasView = Backbone.View.extend({
    initialize: function () {
        this.$el = $('.canvas-options');
        this.$el.find('.colorpicker').colorpicker({format: "hex"}).colorpicker('setValue', this.model.get("color"));
        new Slider({model: this.model, name: "width", jquery_object: this.$el.find(".form-group.width")});
        new Slider({model: this.model, name: "height", jquery_object: this.$el.find(".form-group.height")});
    },
    events: {
        "changeColor .colorpicker": "color_changed",
        "input .colorpicker": "color_changed",
        "change #autoupdate-checkbox": "autoupdate_changed",
        "click .download": "download_image"
    },
    color_changed: function (ev) {
        this.model.set("color", $(ev.target).val());
    },
    autoupdate_changed: function (e) {
        this.model.set("autoupdate", $(e.target).prop("checked"));
    },
    download_image: function () {
        this.model.download_image();
    }
});