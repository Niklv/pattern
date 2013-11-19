var Sample = Backbone.Model.extend({
    objects: null,
    defaults: {
        count: 5,
        placement: "one", //one, random, circle
        angle: 0,
        color: "rgba(0, 0, 0, 0)",
        opacity: 1,
        overlay: null,
        angle_delta: 0,
        offset: 0,
        grid: 1, //1, 4, 9, 16
        x: 0,
        y: 0,
        radius: 40,
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
                max: 20
            },
            placement: {
                values: ["one", "random", "circle"]
            },
            angle_delta: {
                min: 0,
                step: 1,
                max: 360
            },
            grid: {
                values: [1, 4, 9, 16]
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
        }
    },
    initialize: function () {
        this.objects = new Backbone.Collection([], {model: Grid});

        this.set({id: _.random(0, 100000000)});
        this.set_range();
        var range = this.get("range"), img = this.get("img");
        /*init height and width*/
        var w = Math.min(img.width, range.width.max / 2),
            h = Math.min(img.height, range.height.max / 2),
            r = img.width / img.height;
        this.set({width: Math.min(w, h * r), height: Math.min(h, w / r)});

        for (var i = 0; i < range.count.max; i++)
            this.objects.add({
                x: this.get("x"),
                y: this.get("y"),
                angle: this.get("angle"),
                opacity: this.get("opacity"),
                grid: this.get("grid"),
                height: this.get("height"),
                width: this.get("width"),
                img: this.get("img")
            }, {model: this});


        this.change_layout();
        this.layout();
        this.bind("change:placement change:angle change:x change:y change:height change:width change:angle_delta change:grid change:opacity change:count change:offset change:radius", _.debounce(this.analytics, 400));
        this.bind("change", this.layout);
        this.bind("change:range", this.update_to_range);
        this.bind("change:placement", this.change_layout);
        canvas.bind("change:width change:height", this.canvas_size_changed, this);
    },
    analytics: function (diff) {
        for (var key in diff.changed)
            if (diff.changed.hasOwnProperty(key))
                ga('send', 'event', 'part_settings_change', key, diff.changed[key]);
    },
    set_range: function () {
        var range = this.get("range");
        range.width.max = canvas.getWidth() * 2;
        range.height.max = canvas.getHeight() * 2;
        range.x.max = Math.round(canvas.getWidth() / 2);
        range.x.min = -Math.round(canvas.getWidth() / 2);
        range.y.max = Math.round(canvas.getHeight() / 2);
        range.y.min = -Math.round(canvas.getHeight() / 2);
        range.radius.max = Math.min(canvas.getHeight(), canvas.getWidth());
        this.set("range", range);
    },
    update_to_range: function () {
        var range = this.get("range");
        this.set("width", Math.min(this.get("width"), range.width.max));
        this.set("height", Math.min(this.get("height"), range.height.max));
        this.set("x", Math.max(Math.min(this.get("x"), range.x.max), range.x.min));
        this.set("y", Math.max(Math.min(this.get("y"), range.y.max), range.y.min));
        this.set("radius", Math.min(this.get("radius"), range.radius.max));
    },
    change_layout: function () {
        var i;
        this.layout = this.layouts[this.get("placement")];
        //specific preparations
        switch (this.get("placement")) {
            case "one":
                this.objects.at(0).visible(true);
                for (i = 1; i < this.objects.length; i++)
                    this.objects.at(i).visible(false);
                break;
            case "random":
                var data = [], r = this.get("range");
                for (i = 0; i < this.objects.length; i++)
                    data[i] = {
                        x: _.random(r.x.min, r.x.max),
                        y: _.random(r.y.min, r.y.max),
                        angle: _.random(r.angle.min, r.angle.max)
                    };
                for (i = 0; i < this.objects.length; i++)
                    this.objects.at(i).set(data[i]);
                break;
        }

        _.each(this.get("range").placement.values, function (func) {
            this.unbind("change", this.layouts[func]);
        }, this);
        this.bind("change", this.layouts[this.get("placement")]);
    },
    layouts: {
        one: function () {
            var x = this.get("x"),
                y = this.get("y"),
                angle = this.get("angle"),
                opacity = this.get("opacity"),
                grid = this.get("grid"),
                height = this.get("height"),
                width = this.get("width");
            var data = {
                x: x,
                y: y,
                angle: angle,
                opacity: opacity,
                grid: grid,
                height: height,
                width: width
            };
            this.objects.at(0).set(data);

            this.trigger("render");
        },
        random: function () {
            var count = this.get("count"),
                opacity = this.get("opacity"),
                grid = this.get("grid"),
                height = this.get("height"),
                width = this.get("width"),
                i, data = [];
            for (i = 0; i < count; i++)
                data[i] = {
                    opacity: opacity,
                    grid: grid,
                    height: height,
                    width: width
                };
            for (i = 0; i < this.objects.length; i++)
                this.objects.at(i).set(data[i]).visible(true);
            for (i = count; i < this.objects.length; i++)
                this.objects.at(i).visible(false);

            this.trigger("render");
        },
        circle: function () {
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
                i, data = [];
            for (i = 0; i < count; i++)
                data[i] = {
                    x: x + radius * Math.sin(Math.PI * (offset + delta * i) / 180),
                    y: y + radius * Math.cos(Math.PI * (offset + delta * i) / 180),
                    angle: angle + angle_delta * i,
                    opacity: opacity,
                    grid: grid,
                    height: height,
                    width: width
                };
            for (i = 0; i < this.objects.length; i++)
                this.objects.at(i).set(data[i]).visible(true);
            for (i = count; i < this.objects.length; i++)
                this.objects.at(i).visible(false);

            this.trigger("render");
        }
    },
    randomize: function () {
        var r = this.get("range"), data = {};
        data.count = this.rnd("count");
        data.placement = r.placement.values[_.random(0, r.placement.values.length - 1)];
        data.angle = this.rnd("angle");
        data.opacity = this.rnd("opacity");
        data.angle_delta = this.rnd("angle_delta");
        data.offset = this.rnd("offset");
        data.grid = r.grid.values[_.random(0, r.grid.values.length - 1)];
        data.width = this.rnd("width");
        data.height = this.rnd("height");
        data.x = this.rnd("x");
        data.y = this.rnd("y");
        data.radius = this.rnd("radius");
        this.set(data);
    },
    rnd: function (p) {
        var r = this.get("range");
        return _.random(r[p].min / r[p].step, r[p].max / r[p].step) * r[p].step;
    },
    canvas_size_changed: function () {
        this.set_range();
        this.trigger("change:range");
        this.trigger("render");
    }
});

//TODO: 3x grid from prev-prev and next-next img
var Grid = Backbone.Model.extend({
    objects: null,
    model: null,
    initialize: function (attr, opt) {
        this.objects = new Backbone.Collection([], {model: Fabric});
        this.model = opt.model;
        //TODO:remove hardcoded value 121
        for (var i = 0; i < 121; i++)
            this.objects.add(this.attributes, opt);
        this.new_grid();
        //this.grid_size();
        //this.grid_position();
        //this.bind("change:grid", this.grid_size);
        //this.bind("change:grid change:x change:y", this.grid_position);
        //this.bind("change:grid change:width change:height change:angle change:opacity", this.params_change);
        //canvas.bind("change:width change:height", this.grid_position, this);
    },
    new_grid: function () {
        var g = this.get("grid"),
            x = this.get("x"),
            y = this.get("y"),
            step_x = canvas.getWidth() / g,
            step_y = canvas.getHeight() / g,
            i = 0, R = 0, isVisible = true, fabric_index = 0;

        //process CENTER elements
        this.objects.at(fabric_index++).set({show: true});

        //process OTHER elements
        while (isVisible) {
            isVisible = false;
            for (i = -R; i <= R; i++) { //check top and bottom row
                if (this.isVisibleWhen(i * step_x, R * step_y)) {
                    isVisible = true;
                    this.objects.at(fabric_index++).set({show: true, x: x + i * step_x, y: y + R * step_y});
                }
                if (this.isVisibleWhen(i * step_x, -R * step_y)) {
                    isVisible = true;
                    this.objects.at(fabric_index++).set({show: true, x: x + i * step_x, y: y - R * step_y});
                }
            }
            for (i = -R + 1; i <= R - 1; i++) {
                //check left and right row
                if (this.isVisibleWhen(R * step_x, i * step_y)) {
                    isVisible = true;
                    this.objects.at(fabric_index++).set({show: true, x: x + R * step_x, y: y + i * step_y});
                }
                if (this.isVisibleWhen(-R * step_x, i * step_y)) {
                    isVisible = true;
                    this.objects.at(fabric_index++).set({show: true, x: x - R * step_x, y: y + i * step_y});
                }
            }
            if (fabric_index > 100) break;
            R++;
        }
    },
    isVisibleWhen: function (sx, sy) {
        return true;
    },
    params_change: function () {
        var data = {}, i, size = this.get("grid");
        data.width = this.get("width");
        data.height = this.get("height");
        data.opacity = this.get("opacity");
        data.angle = this.get("angle");
        for (i = 0; i < size; i++)
            this.objects.at(i).set(data);
    },
    grid_position: function () {
        var g = this.get("grid"),
            x = this.get("x"),
            y = this.get("y"),
            len = Math.sqrt(g),
            step_x = canvas.getWidth() / ((len - 1) / 2),
            step_y = canvas.getHeight() / ((len - 1) / 2), i;
        for (i = 0; i < len; i++)
            for (var j = 0; j < len; j++) {
                this.objects.at(i * len + j).set({
                    x: x - canvas.getWidth() + j * step_x,
                    y: y - canvas.getHeight() + i * step_y
                }, {silent: true});
                this.objects.at(i * len + j).trigger("change");
            }
    },
    grid_size: function () {
        var g = this.get("grid"), i;
        for (i = 0; i < g; i++)
            this.objects.at(i).set({show: true});
        for (i = g; i < this.objects.length; i++)
            this.objects.at(i).set({show: false});
    },
    visible: function (isVisible) {
        var g = this.get("grid"), i;
        for (i = 0; i < g; i++)
            this.objects.at(i).set({show: isVisible});
    }
});

var Fabric = Backbone.Model.extend({
    _fabric: null,
    defaults: {
        show: false
    },
    initialize: function (attr, opt) {
        this._fabric = new fabric.Image(this.get("img"), {visible: this.get("show"), originX: "center", originY: "center"});
        this.model = opt.model;
        /*filter = new fabric.Image.filters.Tint({
         color: '#3513B0',
         opacity: 1
         });
         this._fabric.filters.push(filter);
         this._fabric.applyFilters();*/
        this.add();
        this.bind("change", this.render);
        this.bind("change:show", this.show);
        this.model.bind("reinitialize", this.add, this);
    },
    add: function () {
        canvas.add(this._fabric);
    },
    show: function () {
        //TODO: strange optimization think about it
        /*
         if (this.get("show") && this._fabric.intersectsWithRect(new fabric.Point(0, 0), new fabric.Point(canvas.width, canvas.height)))
         this._fabric.set("visible", this.get("show"));
         else
         this._fabric.set("visible", false);
         */
        this._fabric.set("visible", this.get("show"));
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
    }
});

//VIEW
var SampleView = Backbone.View.extend({
    $tabHeader: null,
    tagName: "div",
    className: "tab-pane fade",
    template: _.template($("#part-settings-tmpl").remove().text()),
    tabHeaderTemplate: _.template($("#part-settings-tab-header-tmpl").remove().text()),
    controlTemplate: _.template($("#part-settings-control").remove().text()),
    allowed_keys: [],
    init_controls: function () {
        //console.log(this.model.attributes);
        this.$tabHeader.find('button.close').click(_.bind(this.remove, this));
        this.$el.find('.colorpicker').colorPicker("init", {opacity: 1, position: "top"});
        this.$el.find('input.grid-of-obj[value=' + this.model.get('grid') + ']').attr('checked', true);
        this.$el.find('input.placement-of-obj[value=' + this.model.get('placement') + ']').attr('checked', true);
        switch (this.$el.find('.placement input:checked').val()) {
            case "one":
                this.$el.find('.x').show();
                this.$el.find('.y').show();
                this.$el.find('.angle').show();
                this.$el.find('.count').hide();
                this.$el.find('.offset').hide();
                this.$el.find('.angle-delta').hide();
                this.$el.find('.radius').hide();
                this.$el.find('.placement button.rndmz').hide();
                break;
            case "random":
                this.$el.find('.x').hide();
                this.$el.find('.y').hide();
                this.$el.find('.angle').hide();
                this.$el.find('.count').show();
                this.$el.find('.offset').hide();
                this.$el.find('.angle-delta').hide();
                this.$el.find('.radius').hide();
                this.$el.find('.placement button.rndmz').show();
                break;
            case "circle":
                this.$el.find('.x').show();
                this.$el.find('.y').show();
                this.$el.find('.angle').show();
                this.$el.find('.count').show();
                this.$el.find('.offset').show();
                this.$el.find('.angle-delta').show();
                this.$el.find('.radius').show();
                this.$el.find('.placement button.rndmz').hide();
                break;
        }

        new Slider({model: this.model, name: "angle", jquery_object: this.$el.find(".angle")});
        new Slider({model: this.model, name: "opacity", jquery_object: this.$el.find(".opacity")});
        new Slider({model: this.model, name: "width", jquery_object: this.$el.find(".width")});
        new Slider({model: this.model, name: "height", jquery_object: this.$el.find(".height")});
        new Slider({model: this.model, name: "count", jquery_object: this.$el.find(".count")});
        new Slider({model: this.model, name: "x", jquery_object: this.$el.find(".x")});
        new Slider({model: this.model, name: "y", jquery_object: this.$el.find(".y")});
        new Slider({model: this.model, name: "radius", jquery_object: this.$el.find(".radius")});
        new Slider({model: this.model, name: "angle_delta", jquery_object: this.$el.find(".angle-delta")});
        new Slider({model: this.model, name: "offset", jquery_object: this.$el.find(".offset")});

        return this;
    },
    change_settings_order: function () {
        switch (this.$el.find('.placement input:checked').val()) {
            case "one":
                this.$el.find('.x').slideDown(ANIM_TIME);
                this.$el.find('.y').slideDown(ANIM_TIME);
                this.$el.find('.angle').slideDown(ANIM_TIME);
                this.$el.find('.count').slideUp(ANIM_TIME);
                this.$el.find('.offset').slideUp(ANIM_TIME);
                this.$el.find('.angle-delta').slideUp(ANIM_TIME);
                this.$el.find('.radius').slideUp(ANIM_TIME);
                this.$el.find('.placement button.rndmz').hide();
                break;
            case "random":
                this.$el.find('.x').slideUp(ANIM_TIME);
                this.$el.find('.y').slideUp(ANIM_TIME);
                this.$el.find('.angle').slideUp(ANIM_TIME);
                this.$el.find('.count').slideDown(ANIM_TIME);
                this.$el.find('.offset').slideUp(ANIM_TIME);
                this.$el.find('.angle-delta').slideUp(ANIM_TIME);
                this.$el.find('.radius').slideUp(ANIM_TIME);
                this.$el.find('.placement button.rndmz').show();
                break;
            case "circle":
                this.$el.find('.x').slideDown(ANIM_TIME);
                this.$el.find('.y').slideDown(ANIM_TIME);
                this.$el.find('.angle').slideDown(ANIM_TIME);
                this.$el.find('.count').slideDown(ANIM_TIME);
                this.$el.find('.offset').slideDown(ANIM_TIME);
                this.$el.find('.angle-delta').slideDown(ANIM_TIME);
                this.$el.find('.radius').slideDown(ANIM_TIME);
                this.$el.find('.placement button.rndmz').hide();
                break;
        }
    },
    place: function () {
        //this.$el.hide();
        //$('.control-panel > .row:first-child').after(this.$el);
        //1 create tab+
        $('.controls-section .sample-tabs .active').removeClass('active').removeClass('in');
        $('.controls-section .tab-content .active').removeClass('active');
        $('.controls-section .add-new-sample').before(this.$tabHeader);
        $('.controls-section .tab-content').append(this.$el);
        this.$tabHeader.find('a').tab('show');

        //this.$tabHeader.find('a').tab('show');
        //2 paste tab content

        //3 focus to tab

        //this.$el.slideDown(ANIM_TIME);
        //$('li.active').removeClass('active');
        //this.$tabHeader.addClass('active');
        return this;
    },
    render: function () {
        this.$el.html(this.template(_.extend(this.model.attributes, {control: this.controlTemplate})));
        this.$el.attr('id', "settings-panel-" + this.model.get("id"));
        this.$tabHeader = $(this.tabHeaderTemplate(this.model.attributes));
        return this;
    },
    events: {
        "click button.rndmz": "generate_random_layout",
        "change input[type=radio]": "radio_changed",
        "change input.placement-of-obj": "change_settings_order",
        "changeColor input.colorpicker": "color_changed",
        "click button.random": "random"
    },
    generate_random_layout: function () {
        this.model.change_layout();
        this.model.trigger("render");
    },
    random: function () {
        this.$el.find("button.random").attr("disabled", true);
        this.model.randomize();
        var v = this.model.attributes;
        this.$el.find('.placement input[value=' + v.placement + ']').prop('checked', true);
        this.$el.find('.grid input[value=' + v.grid + ']').prop('checked', true);
        this.change_settings_order();
        this.$el.find("button.random").attr("disabled", false);
    },
    onslide: function (e, o) {
        $(e.target).parent().parent().find("input").val(o.value);
        this.save($(e.target).attr("data-option"));
    },
    save: function (p_name) {
        var val = this.$el.find("input[data-option=" + p_name + "]").val();
        if (val == "") val = this.model.default[p_name];
        this.model.set(p_name, parseFloat(val));
    },
    remove: function () {
        samples.remove(this.model);
        //this.$el.animate({width: "0px"}, ANIM_TIME*10, function(){
        //this.remove()
        //});
        this.$el.remove();
        this.$tabHeader.animate({width: "0px"}, ANIM_TIME * 2, function () {
            this.remove()
        });
    },
    radio_changed: function (ev) {
        var p_name = $(ev.target).attr("class").replace("-of-obj", "").replace("-", "_");
        if (p_name == "grid")
            this.model.set(p_name, parseInt($(ev.target).val()));
        else if (p_name == "placement")
            this.model.set(p_name, $(ev.target).val());
    },
    color_changed: function (ev) {
        this.model.set("color", $(ev.target).val());
    }
});

//COLLECTION
var SampleCollection = Backbone.Collection.extend({
    model: Sample,
    initialize: function () {
        this.bind("add", this.add_model);
        this.bind("remove", this.remove_model);
        this.bind("render", canvas.update, canvas);
    },
    add_model: function (model) {
        var view = new SampleView({model: model});
        model.view = view;
        view.render().init_controls().place();
        canvas.update();
    },
    remove_model: function (model) {
        canvas.removeAll();
        for (var i = 0; i < this.length; i++)
            this.at(i).trigger("reinitialize");
        canvas.update();

    }
});
