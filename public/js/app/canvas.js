var Canvas = Backbone.Model.extend({
    defaults: {
        color: "#FFFFFF",
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
            var cnv = $('.canvas-container');
            var off = cnv.offset();
            $('body').css('background-position-x', off.left).css('background-position-y', off.top);
            var prevH = $('.preview-button').height();
            var viewH = $('.controls-section').position().top;
            var canvasH = cnv.height();
            var offset = (viewH - prevH - canvasH) / 2 + prevH;
            cnv.css('margin-top', offset + "px");
        }).resize();
        new CanvasView({model: this});
        this.on("change", this.update);
        this.on("change:width", this.width);
        this.on("change:height", this.height);
        this.on("change:color", this.color);
        this.on("change:autoupdate", this.update);
    },
    canvas: function () {
        this.canvas = new fabric.Canvas("canvas");
        this.canvas.renderOnAddRemove = false;
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
        //ga('send', 'event', 'pattern_bg_color', 'set', this.get("color"));
    },
    width: function () {
        this.canvas.setWidth(this.get("width"));
        $('#canvas-wrapper').width(this.get("width"));
        $(window).resize();
    },
    height: function () {
        this.canvas.setHeight(this.get("height"));
        $('#canvas-wrapper').height(this.get("height"));
        $(window).resize();
    },
    removeAll: function () {
        this.canvas._objects = [];
    },
    update: function () {
        this.canvas._objects = _.sortBy(this.canvas._objects, function (obj) {
            return obj.layer;
        });
        if (this.get("autoupdate")) {
            this.render_to_bg();
        } else {
            this.canvas.renderAll(true);
        }

    },
    render_to_bg: function () {
        $(window).resize();
        $('body').css('background-image', 'url(' + this.canvas.toDataURL({format: "png", quality: 1}) + ')');

        /*
         this.canvas.renderAll(false);
         var ctx = this.canvas.getContext("2d");
         var myImageData = ctx.getImageData(0, 0, this.canvas.getWidth(), this.canvas.getHeight());
         var bg = document.getElementById('bg_canvas');
         var bgCtx = bg.getContext("2d");
         var w = $(window).width(), h = $(window).height();
         bg.width = w;
         bg.height = h;
         while(w>0){
         w-=this.canvas.getWidth();
         var oldh=h;
         while(oldh>0){
         oldh-=this.canvas.getHeight();
         bgCtx.putImageData(myImageData, w, oldh);
         }
         }
         /*bgCtx.putImageData(myImageData, 0, 0);
         bgCtx.putImageData(myImageData, 300, 0);
         bgCtx.putImageData(myImageData, 600, 0);
         bgCtx.putImageData(myImageData, 900, 0);
         bgCtx.putImageData(myImageData, 1200, 0);
         bgCtx.putImageData(myImageData, 1500, 0);
         bgCtx.putImageData(myImageData, 1800, 0);*/
    },
    download_image: function () {
        var data = this.canvas.toDataURL({format: "png", quality: 1});
        var b64 = data.split(',')[1];
        var blob = b64toBlob(b64, "image/png");
        saveAs(blob, "awesome-pattern_" + _.random(100000, 200000) + ".png");
        //ga('send', 'event', 'download_pattern', 'download');
        //ga('send', 'event', 'download_pattern', 'width', this.get("width"));
        //ga('send', 'event', 'download_pattern', 'height', this.get("height"));
    }
});

var CanvasView = Backbone.View.extend({
    initialize: function () {
        this.$el = $('.canvas-options');
        this.$el.find('.colorpicker').colorPicker("init", {}).colorPicker("setHEX", this.model.get("color"));
        new Slider({model: this.model, name: "width", jquery_object: this.$el.find(".width")});
        new Slider({model: this.model, name: "height", jquery_object: this.$el.find(".height")});
    },
    events: {
        "changeColor .colorpicker": "color_changed",
        "input .colorpicker": "color_changed",
        "change #autofill-checkbox": "autoupdate_changed",
        "click .download": "download_image"
    },
    color_changed: function (ev) {
        this.model.set("color", $(ev.target).colorPicker("getHEX"));
    },
    autoupdate_changed: function (e) {
        this.model.set("autoupdate", $(e.target).prop("checked"));
    },
    download_image: function () {
        this.model.download_image();
    }
});