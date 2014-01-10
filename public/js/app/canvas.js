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
        APP.$wrp = $('#canvas-wrapper');
        APP.$cnv = $('.canvas-container');
        APP.$prvbtn = $('.preview-button');
        APP.$cntr_sec = $('.controls-section')
        $(window).resize(function () {
            var preview_h = APP.$prvbtn.height(),
                view_h = APP.$cntr_sec.position().top,
                canvas_w = APP.$cnv.width(),
                canvas_h = APP.$cnv.height(),
                offset = (view_h - preview_h - canvas_h) / 2 + preview_h,
                s_w = $(window).width() / canvas_w,
                s_h = (view_h - preview_h) / canvas_h,
                s = Math.min(1, Math.min(s_w, s_h)),
                margin_left;
            offset = (s_h < 1) ? preview_h : Math.max(preview_h, offset);
            margin_left = (s_w < 1) ? ($(window).width() - canvas_w) / 2 : "";
            APP.$wrp.css({
                '-webkit-transform': 'scale(' + s + ')',
                'transform': 'scale(' + s + ')',
                'margin-left': margin_left,
                'margin-top': offset + "px"
            });
            var cnv_off = APP.$cnv.offset();
            $('body').css({
                'background-position-x': cnv_off.left,
                'background-position-y': cnv_off.top,
                'background-size': s * canvas_w + 'px ' + s * canvas_h + 'px'
            });
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
            this.canvas.renderAll(false);
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