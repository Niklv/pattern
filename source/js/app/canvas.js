var Canvas = Backbone.Model.extend({
    defaults: {
        color: "#FFFFFF",
        autoupdate: false,
        height: 300,
        width: 300,
        lock_ratio: true,
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
        $(window).resize(_.debounce(function () {
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
            //console.log(cnv_off.left,cnv_off.top, s * canvas_w + 'px ' + s * canvas_h + 'px');
            $('.pattern-preview-area').css({
                'background-position': cnv_off.left + 'px ' + cnv_off.top + 'px',
                'background-size': s * canvas_w + 'px ' + s * canvas_h + 'px'
            });
        }, 100)).resize();
        new CanvasView({model: this});
        this.update = _.throttle(this.update, 20);
        this.on("change", this.update);
        this.on("change:lock_ratio", this.lock_ratio);
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
        if (this.get('lock_ratio') && (this.get('width') != this.get('height')))
            this.set('height', this.get('width'));
        $(window).resize();
    },
    height: function () {
        this.canvas.setHeight(this.get("height"));
        $('#canvas-wrapper').height(this.get("height"));
        if (this.get('lock_ratio') && (this.get('width') != this.get('height')))
            this.set('width', this.get('height'));
        else
            $(window).resize();
    },
    removeAll: function () {
        this.canvas._objects = [];
    },
    lock_ratio: function () {
        var max = Math.max(this.get('width'), this.get('height'));
        this.set({
            width: max,
            height: max
        });
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
        $('.pattern-preview-area').css('background-image', 'url(' + this.canvas.toDataURL({format: "png", quality: 1}) + ')');
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
        $('.autofill-checkbox span').tooltip();
        if (this.model.get("lock_ratio"))
            this.$el.find(".lock-origin-ratio").addClass("locked");
        this.colorpicker = new Colorpicker(null, {el: this.$el.find('.color-picker').eq(0), alpha: false});
        this.colorpicker.set("hex", this.model.get("color"));
        this.colorpicker.view.update_all();
        this.colorpicker.on("change:color", _.bind(this.color_changed, this));
        new Slider({model: this.model, name: "width", jquery_object: this.$el.find(".width")});
        new Slider({model: this.model, name: "height", jquery_object: this.$el.find(".height")});
    },
    events: {
        "input .colorpicker": "color_changed",
        "change #autofill-checkbox": "autoupdate_changed",
        "click .lock-origin-ratio": "ratio_changed",
        "click .download": "download_image"
    },
    ratio_changed: function () {
        this.$el.find(".lock-origin-ratio").toggleClass("locked");
        this.model.set("lock_ratio", !(this.model.get("lock_ratio")));
    },
    color_changed: function (ev) {
        this.model.set("color", this.colorpicker.get("hex"));
    },
    autoupdate_changed: function (e) {
        this.model.set("autoupdate", $(e.target).prop("checked"));
    },
    download_image: function () {
        this.model.download_image();
    }
});