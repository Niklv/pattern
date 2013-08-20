var CANVAS_WIDTH = 300;
var CANVAS_HEIGHT = 300;
var ANIM_TIME = 200;
var canvas;


//////MODELS

var Settings = Backbone.Model.extend({
    objects: null,
    default: {
        count: 1,
        placement: "random", //random, circle
        angle: 0,
        color: "rgba(0, 0, 0, 0)",
        opacity: 1,
        overlay: null,
        angle_delta: 0,
        offset: 0,
        grid: 9, //9, 25, 49
        x: 0,
        y: 0,
        radius: 40
    },
    range: {
        angle: {
            min: -180,
            step: 1,
            max: 180
        },
        offset: {
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
            min: 1,
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
            step: 1
        },
        y: {
            step: 1
        },
        radius: {
            min: 0,
            step: 1
        }
    },
    initialize: function () {
        this.set_range();
        this.objects = new Backbone.Collection([], {model: GridSettings});
        //this.bind("change", this.update);
        this.set({id: _.random(0, 1000000)});

        /*ratio height witdh init*/
        //TODO: find bug with get width and height
        var w = Math.min(this.get("img").width, this.range.width.max),
            h = Math.min(this.get("img").height, this.range.height.max),
            r = w / h;
        this.set({width: Math.min(w, h * r), height: Math.min(h, w / r)});
        this.set(this.default);
        this.bind("change", this.random_layout);
        //this.count_changed();
        //this.circle_layout();
        //this.bind("change:count", this.count_changed);
        //this.bind("change:placement", this.layout_changed);
        /*this.bind("change:angle " +
         "change:color " +
         "change:opacity " +
         "change:overlay  " +
         "change:angle_delta " +
         "change:offset " +
         "change:grid " +
         "change:x " +
         "change:y " +
         "change:width " +
         "change:height " +
         "change:radius", this.change_options); */
    },
    set_range: function () {
        this.range.width.max = canvas.getWidth() * 2;
        this.range.height.max = canvas.getHeight() * 2;
        this.range.x.max = Math.round(canvas.getWidth() / 2);
        this.range.x.min = -Math.round(canvas.getWidth() / 2);
        this.range.y.max = Math.round(canvas.getHeight() / 2);
        this.range.y.min = -Math.round(canvas.getHeight() / 2);
        this.range.radius.max = Math.min(canvas.getHeight(), canvas.getWidth()) * 2;
    },
    fabric: function () {
        //this.fabric_obj = new fabric.Image(this.get("img"));
        //this.update();
        //canvas.add(this.fabric_obj);
    },
    count_changed: function (init_with_this_data) {
        console.log(this.objects.length, this.get("count"));
        while (this.objects.length > this.get("count"))
            this.objects.remove(this.objects.last());

        while (this.objects.length < this.get("count"))
            this.objects.add(init_with_this_data);
    },
    layout_changed: function () {
        console.log("layout changed");
        //console.log(arguments);
        //var count = this.get("count");

        /*while (this.objects.length > this.get("count")) {
         this.objects.pop();
         }

         while (this.objects.length > this.get("count"))
         this.objects.add(new GridSettings(this));
         */
    },
    circle_layout: function () {
        var count = this.get("count"),
            delta = 360 / count,
            offset = this.get("offset"),
            radius = this.get("radius"),
            x = this.get("x"),
            y = this.get("y"),
            angle = this.get("angle"),
            angle_delta = this.get("angle_delta"),
            opacity = this.get("opacity"),
            grid = this.get("grid"),
            height = this.get("height"),
            width = this.get("width"),
            img = this.get("img");
        for (var i = 0; i < count; i++) {
            var data = {
                x: x + radius * Math.sin(offset + delta * i),
                y: y + radius * Math.cos(offset + delta * i),
                angle: angle + angle_delta * i,
                opacity: opacity,
                grid: grid,
                height: height,
                width: width,
                img: img
            };
            this.objects.at(i).set(data);
        }
    },
    random_layout: function () {
        //this.count_changed();
        var x = this.get("x"),
            y = this.get("y"),
            angle = this.get("angle"),
            opacity = this.get("opacity"),
            grid = this.get("grid"),
            height = this.get("height"),
            width = this.get("width"),
            img = this.get("img");
        var data = {
            x: x,
            y: y,
            angle: angle,
            opacity: opacity,
            grid: grid,
            height: height,
            width: width,
            img: img
        };
        if (this.objects.length > 0)
            this.objects.at(0).set(data);
        else
            this.objects.add(data);
        canvas.renderAll();
    },
    change_options: function () {
        //this.circle_layout();
    },
    update: function () {
        /*this.fabric_obj.set({
         left: canvas.getWidth() / 2 + canvas.getWidth() * this.get("x") / 100,
         top: canvas.getHeight() / 2 + canvas.getHeight() * this.get("y") / 100,
         width: this.get("width"),
         height: this.get("height"),
         angle: this.get("angle"),
         opacity: this.get("opacity")
         });
         this.fabric_clones.update();
         canvas.renderAll();*/
    },
    randomize: function () {
        console.log("RANDOMIZE!");
    },
    remove: function () {
        for (var i = 0; i < this.objects.length; i++)
            this.objects.at(i).remove();
        this.objects.reset();
        canvas.renderAll();
    }
});

var GridSettings = Backbone.Model.extend({ //must render grid
    fabric_objects: null,
    default: {
        grid: 9,
        x: 0,
        y: 0,
        opacity: 1,
        angle: 0
    },
    initialize: function () {
        this.fabric_objects = new Backbone.Collection([], {model: FabricObject});
        //TODO:remove hardcoded value 81
        for (var i = 0; i < 81; i++)
            this.fabric_objects.add(this.attributes);
        this.bind("change", this.calculate_grid);
        this.bind("remove", this.remove);

        //console.log("INIT GRIDSETTINGS COLLECTION");
        //console.log(this.attributes);
        this.calculate_grid();
        //this.grid.add({});
        //console.log("INIT GRIDSETTINGS COLLECTION", options.global_settings);
        /*this.set("grid", options.global_settings.get("grid"));
         this.set("x", options.global_settings.get("x"));
         this.set("y", options.global_settings.get("y"));
         this.set("angle", options.global_settings.get("angle"));
         this.set("opacity", options.global_settings.get("opacity"));

         console.log(this.attributes);
         //settings.on("change", this.update());
         for (var i = 0; i < this.get("grid"); i++)
         this.grid.add({});*/
    },
    calculate_grid: function () {
        var g = this.get("grid"),
            x = this.get("x"),
            y = this.get("y"),
            len = Math.sqrt(g),
            step_x = canvas.getWidth() / ((len - 1) / 2),
            step_y = canvas.getHeight() / ((len - 1) / 2);


        var i;
        for (i = 0; i < g; i++)
            this.fabric_objects.at(i).set("show", true);

        for (i = g; i < this.fabric_objects.length; i++)
            this.fabric_objects.at(i).set("show", false);

        for (i = 0; i < len; i++)
            for (var j = 0; j < len; j++) {
                this.fabric_objects.at(i * len + j).set(this.attributes, {ignore: true});
                this.fabric_objects.at(i * len + j).set({
                    x: x - canvas.getWidth() + j * step_x,
                    y: y - canvas.getHeight() + i * step_y
                });
            }
    },
    remove: function () {
        //while (this.fabric_objects.length)
        //    this.fabric_objects.remove(this.fabric_objects.at(0));
        console.log(this.fabric_objects.length);
        for (i = 0; i < this.fabric_objects.length; i++)
            this.fabric_objects.at(i).remove();
        this.fabric_objects.reset();
        console.log(this.fabric_objects.length);
    }
});

var FabricObject = Backbone.Model.extend({ //must render grid
    _fabric: null,
    default: {
        show: false
    },
    initialize: function () {
        this._fabric = new fabric.Image(this.get("img"));
        this._fabric.set("visible", false);
        this.add();
        this.bind("change", this.render);
        this.bind("change:show", this.show);
        this.bind("remove reset", this.remove);
    },
    show: function () {
        if (this.get("show"))
            this._fabric.set("visible", true);
        else
            this._fabric.set("visible", false);
    },
    add: function () {
        canvas.add(this._fabric);
    },
    render: function () {
        this._fabric.set({
            left: canvas.getCenter().left + this.get("x"),
            top: canvas.getCenter().top - this.get("y"),
            width: this.get("width"),
            height: this.get("height"),
            angle: this.get("angle"),
            opacity: this.get("opacity")
        });
    },
    remove: function () {
        canvas.remove(this._fabric);
    }
});

//////COLLECTION

var SettingsCollection = Backbone.Collection.extend({
    model: Settings,
    initialize: function () {
        this.bind("add", this.add_model);
        this.bind("remove", this.remove_model);
        //this.on("change", this.render);
    },
    add_model: function (model) {
        var view = new SettingsView({model: model});
        view.render().place().init_controls();
        model.fabric();
    },
    remove_model: function (model) {
        model.remove();
    }
});

//////VIEW

var SettingsView = Backbone.View.extend({
    tagName: "div",
    className: "row pattern-part",
    template: _.template($("#part-settings-tmpl").html()),
    allowed_keys: [],
    init_controls: function () {
        //console.log(this.model.attributes);
        this.$el.find('.colorpicker').colorpicker({format: "rgba"});
        this.$el.find('input.grid-of-obj[value=' + this.model.get('grid') + ']').attr('checked', true);
        this.$el.find('input.placement-of-obj[value=' + this.model.get('placement') + ']').attr('checked', true);
        this.model.on("change", this.change_settings_order, this);
        var isCircle = this.$el.find('.placement input:checked').val() == "circle";
        var isRandom = this.$el.find('.placement input:checked').val() == "random";
        var isOneItem = this.$el.find('.count input').val() == 1;
        if (isCircle || isOneItem) {
            this.$el.find('.form-group.x').show();
            this.$el.find('.form-group.y').show();
        } else {
            this.$el.find('.form-group.x').hide();
            this.$el.find('.form-group.y').hide();
        }
        if (isCircle) {
            this.$el.find('.form-group.offset').show();
            this.$el.find('.form-group.angle-delta').show();
            this.$el.find('.form-group.radius').show();
        } else if (isRandom) {
            this.$el.find('.form-group.offset').hide();
            this.$el.find('.form-group.angle-delta').hide();
            this.$el.find('.form-group.radius').hide();
        }

        this.setup_allowed_keys();
        this.$el.find("div.slider").each(_.bind(function (n, slider) {
            var p_name = $(slider).attr("data-option");
            $(slider).parent().parent().find("input").val(this.get(p_name));
            $(slider).slider({
                animate: ANIM_TIME,
                min: this.range[p_name].min,
                max: this.range[p_name].max,
                step: this.range[p_name].step,
                value: this.get(p_name),
                range: "min"
            });
        }, this.model));
        return this;
    },
    change_settings_order: function () {
        var isCircle = this.$el.find('.placement input:checked').val() == "circle";
        var isRandom = this.$el.find('.placement input:checked').val() == "random";
        var isOneItem = this.$el.find('.count input').val() == 1;
        if (isCircle || isOneItem) {
            this.$el.find('.form-group.x').slideDown(ANIM_TIME);
            this.$el.find('.form-group.y').slideDown(ANIM_TIME);
        } else {
            this.$el.find('.form-group.x').slideUp(ANIM_TIME);
            this.$el.find('.form-group.y').slideUp(ANIM_TIME);
        }

        if (isCircle) {
            this.$el.find('.form-group.offset').slideDown(ANIM_TIME);
            this.$el.find('.form-group.angle-delta').slideDown(ANIM_TIME);
            this.$el.find('.form-group.radius').slideDown(ANIM_TIME);
        } else if (isRandom) {
            this.$el.find('.form-group.offset').slideUp(ANIM_TIME);
            this.$el.find('.form-group.angle-delta').slideUp(ANIM_TIME);
            this.$el.find('.form-group.radius').slideUp(ANIM_TIME);
        }
    },
    place: function () {
        var last = $('.control-panel > .row.pattern-part').last();
        this.$el.hide();
        if (last.length > 0)
            last.after(this.$el);
        else
            $('.control-panel > .row:first-child').after(this.$el);
        this.$el.slideDown(ANIM_TIME);
        return this;
    },
    render: function () {
        this.$el.html(this.template(this.model.attributes));
        return this;
    },
    events: {
        "click button.delete": "remove",
        "change input[type=radio]": "radio_changed",
        "changeColor input.colorpicker": "color_changed",
        "click button.random": "random",
        "slide .slider": "onslide",
        "input input": "oninput",
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
        this.save(slider.attr("data-option"));
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
    oninput: function (e) {
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
        if (value < opt.min) {
            slider.slider("value", opt.min);
            $(e.target).val(opt.min);
        } else if (value > opt.max) {
            slider.slider("value", opt.max);
            $(e.target).val(opt.max);
        } else
            slider.slider("value", value);
        this.save(slider.attr("data-option"));
    },
    random: function () {
        this.model.randomize();
    },
    onslide: function (e, o) {
        $(e.target).parent().parent().find("input").val(o.value);
        this.save($(e.target).attr("data-option"));
    },
    save: function (p_name) {
        var val = this.$el.find("input[data-option=" + p_name + "]").val();
        if (val == "") val = this.model.default[p_name];
        this.model.set(p_name, parseFloat(val));
        //console.log(this.model.attributes);
    },
    remove: function () {
        parts.remove(this.model);
        this.$el.slideUp(ANIM_TIME, function () {
            $(this).remove()
        });

        /*this.$el.slideUp(50 * ANIM_TIME, function () {
         $(this).remove()
         });//.remove();
         */
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
    canvas.renderOnAddition = false;
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


var parts = new SettingsCollection();
init();